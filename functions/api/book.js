// POST /api/book — validate the rental agreement form, store it in KV, alert admin on Telegram.

const BIKES = ["Yamaha Aerox 155", "Royal Enfield Hunter 350", "KTM Duke 200"];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Telegram HTML mode needs these three characters escaped.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// "14:30" -> "2:30 PM"
const to12h = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

// Server-side validation (never trust the browser).
function validate(b) {
  const errors = [];
  const clean = (v, max) => String(v ?? "").trim().slice(0, max);
  const d = {
    date: clean(b.date, 10),
    vehicleNo: clean(b.vehicleNo, 20),
    name: clean(b.name, 80),
    address: clean(b.address, 200),
    duration: Number(b.duration),
    unit: b.unit === "Day" ? "Day" : "Hrs",
    license: clean(b.license, 30),
    pickupTime: clean(b.pickupTime, 5),
    dropTime: clean(b.dropTime, 5),
    phone: clean(b.phone, 20),
    destination: clean(b.destination, 100),
    bike: clean(b.bike, 60),
  };
  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!d.name) errors.push("Name is required.");
  if (!d.address) errors.push("Address is required.");
  if (!Number.isInteger(d.duration) || d.duration < 1 || d.duration > 99) errors.push("Enter a valid duration.");
  if (d.license.length < 4) errors.push("Driving licence number is required.");
  if (!time.test(d.pickupTime)) errors.push("Choose a pick up time.");
  if (!time.test(d.dropTime)) errors.push("Choose a drop time.");
  if (!/^\+?[0-9\s-]{7,15}$/.test(d.phone)) errors.push("Enter a valid phone number.");
  if (!d.destination) errors.push("Destination is required.");
  if (!BIKES.includes(d.bike)) errors.push("Choose a bike.");
  if (isNaN(Date.parse(d.date))) errors.push("Choose a date.");
  if (b.agreed !== true) errors.push("You must accept the terms and conditions.");
  const sig = String(b.signature ?? "");
  if (!/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(sig) || sig.length > 200000) errors.push("A signature is required.");
  return { d, sig, errors };
}

async function notifyTelegram(env, id, d) {
  if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const text =
    `🏍 <b>New reservation ${esc(id)}</b>\n\n` +
    `<b>Name:</b> ${esc(d.name)}\n<b>Phone:</b> ${esc(d.phone)}\n<b>Address:</b> ${esc(d.address)}\n` +
    `<b>Licence:</b> ${esc(d.license)}\n<b>Bike:</b> ${esc(d.bike)}${d.vehicleNo ? " · " + esc(d.vehicleNo) : ""}\n` +
    `<b>Date:</b> ${esc(d.date)}\n<b>Pick up:</b> ${to12h(d.pickupTime)}  <b>Drop:</b> ${to12h(d.dropTime)}\n` +
    `<b>Duration:</b> ${d.duration} ${d.unit}\n<b>Destination:</b> ${esc(d.destination)}\n` +
    `<b>Terms accepted and signed</b> ✅`;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }

  const { d, sig, errors } = validate(body);
  if (errors.length) return json({ error: errors[0], errors }, 400);

  const uuid = crypto.randomUUID ? crypto.randomUUID().slice(0, 4) : Math.random().toString(36).slice(2, 6);
  const id = `BKG-${Date.now()}-${uuid}`;
  const booking = { id, ...d, agreed: true, signature: sig, status: "Pending", createdAt: new Date().toISOString() };

  await env.BOOKINGS_KV.put(id, JSON.stringify(booking));

  // A Telegram hiccup must never lose a booking, so failures are swallowed.
  try { await notifyTelegram(env, id, d); } catch (e) { console.log("Telegram failed", e); }

  return json({ success: true, id });
}
