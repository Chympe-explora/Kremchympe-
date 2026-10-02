// POST /api/book — validate a package booking, re-price it on the server, store it in KV,
// and send the details + payment receipt to the admin on Telegram.
// Prices come from /pricing.json (the same file the booking page reads).

import PRICING from "../../pricing.json";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Telegram HTML mode needs these three characters escaped.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// An option counts only if ticked AND its parent (e.g. Camping) is ticked.
function chosen(pkg, ids) {
  const on = new Set(ids);
  return pkg.options.filter((o) => on.has(o.id) && (!o.requires || on.has(o.requires)));
}
const qtyOf = (itemQty, oid, iid) => {
  const n = Number(itemQty && itemQty[oid] && itemQty[oid][iid]);
  return Number.isInteger(n) && n > 0 && n <= 50 ? n : 0;
};

// Same rules as calc() in reserve.html.
export function price(pkg, people, children, optionIds, itemQty = {}) {
  const kids = pkg.childPrice == null ? 0 : children;
  const lines = [{ label: "Adults", qty: people, amount: people * pkg.adultPrice }];
  if (kids > 0) lines.push({ label: "Children", qty: kids, amount: kids * pkg.childPrice });
  const heads = people + kids;
  for (const o of chosen(pkg, optionIds)) {
    if (o.items) {
      for (const it of o.items) {
        const q = qtyOf(itemQty, o.id, it.id);
        if (q) lines.push({ label: `${o.label} – ${it.label}`, qty: q, amount: q * it.price });
      }
    } else lines.push({ label: o.label, qty: o.unit === "person" ? heads : 1, amount: o.unit === "person" ? heads * o.price : o.price });
  }
  return { lines, total: lines.reduce((t, l) => t + l.amount, 0) };
}

const MAXP = Number(PRICING.maxPeople) || 50;
const todayIST = () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
const addDays = (iso, n) => new Date(Date.parse(iso) + n * 86400000).toISOString().slice(0, 10);

export function validate(b) {
  const errors = [];
  const codes = [];
  const err = (code, msg) => { codes.push(code); errors.push(msg); };
  const clean = (v, max) => String(v ?? "").trim().slice(0, max);
  const key = clean(b.package, 20);
  const pkg = PRICING.packages[key];
  if (!pkg) return { errors: ["Choose a package."], codes: ["package"] };

  const people = Number(b.people);
  const children = pkg.childPrice == null ? 0 : Number(b.children || 0);
  const d = {
    package: key,
    packageName: pkg.name,
    name: clean(b.name, 80),
    whatsapp: clean(b.whatsapp, 20),
    date: clean(b.date, 10),
    request: clean(b.request, 500),
    people,
    children,
    options: Array.isArray(b.options) ? chosen(pkg, b.options.map(String)).map((o) => o.id) : [],
    payMethod: ["qr", "upi", "bank"].includes(b.payMethod) ? b.payMethod : "qr",
  };
  if (!d.name) err("name", "Name is required.");
  if (!/^\+?[0-9\s-]{7,15}$/.test(d.whatsapp)) err("whatsapp", "Enter a valid WhatsApp number.");
  if (!Number.isInteger(people) || people < 1 || people > MAXP) err("people", "Enter a valid number of people.");
  if (!Number.isInteger(children) || children < 0 || children > MAXP) err("children", "Enter a valid number of children.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date) || isNaN(Date.parse(d.date))) err("date", "Choose a date.");
  else if (d.date < addDays(todayIST(), pkg.minDaysAhead))
    pkg.minDaysAhead > 0 ? err("dateExpedition", `This package must be booked at least ${pkg.minDaysAhead} days ahead.`) : err("datePast", "Choose a future date.");

  if (errors.length) return { errors, codes };

  for (const o of chosen(pkg, d.options)) {
    if (o.items && !o.items.some((it) => qtyOf(b.itemQty, o.id, it.id)))
      err("items", `Choose at least one item for ${o.label}.`);
  }
  if (errors.length) return { errors, codes };
  const { lines, total } = price(pkg, people, children, d.options, b.itemQty);
  const advance = Number(b.advance);
  const min = Math.min(PRICING.minAdvance, total);
  if (!Number.isFinite(advance) || advance < min || advance > total)
    err("advance", `Advance must be between ${inr(min)} and ${inr(total)}.`);
  if (b.agreed !== true) err("agree", "You must accept the Cancellation Policy.");

  const receipt = String(b.receipt ?? "");
  const m = receipt.match(/^data:(image\/jpeg|image\/png|application\/pdf);base64,([A-Za-z0-9+/=]+)$/);
  if (!m || receipt.length > 2200000) err("receipt", "A payment receipt (image or PDF, under ~1.5 MB) is required.");

  return { d, lines, total, advance, balance: total - advance, receipt, receiptType: m && m[1], errors, codes };
}

// Bookings (details + price + receipt) go to the BOOKING GROUP, not the admin's own chat.
// Set TELEGRAM_BOOKING_GROUP_ID to the group's id (negative number, e.g. -1001234567890).
// Falls back to TELEGRAM_CHAT_ID only if the group variable is not set.
async function notifyTelegram(env, id, v) {
  const chatId = env.TELEGRAM_BOOKING_GROUP_ID || env.TELEGRAM_CHAT_ID;
  if (!env.TELEGRAM_TOKEN || !chatId) return;
  const { d } = v;
  const items = v.lines.map((l) => `• ${esc(l.label)}${l.qty > 1 ? " × " + l.qty : ""}: ${inr(l.amount)}`).join("\n");
  const text =
    `🏕 <b>New booking ${esc(id)}</b>\n<b>${esc(d.packageName)}</b>\n\n` +
    `<b>Name:</b> ${esc(d.name)}\n<b>WhatsApp:</b> ${esc(d.whatsapp)}\n<b>Date:</b> ${esc(d.date)}\n` +
    `<b>People:</b> ${d.people}${d.children ? " + " + d.children + " children" : ""}\n` +
    (d.request ? `<b>Request:</b> ${esc(d.request)}\n` : "") +
    `\n${items}\n\n<b>Total:</b> ${inr(v.total)}\n<b>Advance paid (${esc(d.payMethod.toUpperCase())}):</b> ${inr(v.advance)}\n<b>Balance:</b> ${inr(v.balance)}\n\nReceipt attached below. Please verify before confirming.`;
  const api = (m) => `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/${m}`;
  const r1 = await fetch(api("sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  if (!r1.ok) console.log("Telegram sendMessage failed", r1.status, await r1.text());
  // Receipt as a document so PDFs and images both work.
  const bin = Uint8Array.from(atob(v.receipt.split(",")[1]), (c) => c.charCodeAt(0));
  const ext = v.receiptType === "application/pdf" ? "pdf" : v.receiptType === "image/png" ? "png" : "jpg";
  const fd = new FormData();
  fd.append("chat_id", chatId);
  fd.append("caption", `Receipt for ${id}`);
  fd.append("document", new Blob([bin], { type: v.receiptType }), `receipt-${id}.${ext}`);
  const r2 = await fetch(api("sendDocument"), { method: "POST", body: fd });
  if (!r2.ok) console.log("Telegram sendDocument failed", r2.status, await r2.text());
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON.", code: "json" }, 400); }

  const v = validate(body);
  if (v.errors.length) return json({ error: v.errors[0], code: v.codes[0], errors: v.errors }, 400);

  const uuid = crypto.randomUUID ? crypto.randomUUID().slice(0, 4) : Math.random().toString(36).slice(2, 6);
  const id = `BKG-${Date.now()}-${uuid}`;
  const booking = {
    id, ...v.d, items: v.lines, total: v.total, advance: v.advance, balance: v.balance,
    receipt: v.receipt, agreed: true, status: "Pending", createdAt: new Date().toISOString(),
  };

  await env.BOOKINGS_KV.put(id, JSON.stringify(booking));

  // A Telegram hiccup must never lose a booking, so failures are swallowed.
  try { await notifyTelegram(env, id, v); } catch (e) { console.log("Telegram failed", e); }

  return json({ success: true, id, total: v.total, balance: v.balance });
}
