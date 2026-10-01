// POST /api/book — validate, store in KV, alert admin on Telegram.

const BIKES = ["Yamaha Aerox 155", "Royal Enfield Hunter 350", "KTM Duke 200"];
const PLACES = ["Shillong", "Jowai", "Guwahati"];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Telegram HTML mode needs these three characters escaped.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Server-side validation (never trust the browser).
function validate(b) {
  const errors = [];
  const clean = (v, max) => String(v ?? "").trim().slice(0, max);
  const d = {
    name: clean(b.name, 80),
    phone: clean(b.phone, 20),
    email: clean(b.email, 120),
    bike: clean(b.bike, 60),
    pickupDate: clean(b.pickupDate, 10),
    returnDate: clean(b.returnDate, 10),
    location: clean(b.location, 40),
    message: clean(b.message, 500),
  };
  if (!d.name) errors.push("Name is required.");
  if (!/^\+?[0-9\s-]{7,15}$/.test(d.phone)) errors.push("Enter a valid phone number.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.push("Enter a valid email address.");
  if (!BIKES.includes(d.bike)) errors.push("Choose a bike.");
  if (!PLACES.includes(d.location)) errors.push("Choose a pickup location.");
  const p = Date.parse(d.pickupDate), r = Date.parse(d.returnDate);
  if (isNaN(p) || isNaN(r)) errors.push("Choose pickup and return dates.");
  else if (r <= p) errors.push("Return date must be after pickup date.");
  return { d, errors };
}

async function notifyTelegram(env, id, d) {
  if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const text =
    `🏍 <b>New booking ${esc(id)}</b>\n\n` +
    `<b>Name:</b> ${esc(d.name)}\n<b>Phone:</b> ${esc(d.phone)}\n<b>Email:</b> ${esc(d.email)}\n` +
    `<b>Bike:</b> ${esc(d.bike)}\n<b>Pickup:</b> ${esc(d.pickupDate)} · ${esc(d.location)}\n` +
    `<b>Return:</b> ${esc(d.returnDate)}\n<b>Message:</b> ${esc(d.message || "—")}`;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
  });
}

export async function onRequestPost({ request, env, waitUntil }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }

  const { d, errors } = validate(body);
  if (errors.length) return json({ error: errors[0], errors }, 400);

  const uuid = crypto.randomUUID ? crypto.randomUUID().slice(0, 4) : Math.random().toString(36).slice(2, 6);
  const id = `BKG-${Date.now()}-${uuid}`;
  const booking = { id, ...d, status: "Pending", createdAt: new Date().toISOString() };

  await env.BOOKINGS_KV.put(id, JSON.stringify(booking));

  // A Telegram hiccup must never lose a booking, so failures are swallowed.
  try { await notifyTelegram(env, id, d); } catch (e) { console.log("Telegram failed", e); }

  return json({ success: true, id });
}
