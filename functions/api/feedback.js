// /api/feedback
//   GET  -> newest visitor comments (those with text), for the "What Our Travelers Say" strip
//   POST -> { rating 1-5, name?, comment?, website (spam trap) }
// All reviews live in ONE KV key ("REVIEWS", newest first, max 200) so a page view costs a single KV read.

const KEY = "REVIEWS";
const MAX_KEPT = 200, MAX_SHOWN = 50;

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra } });

// Plain text only: drop control characters, collapse whitespace, trim, cap length.
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

async function loadAll(env) {
  const list = await env.BOOKINGS_KV.get(KEY, "json");
  return Array.isArray(list) ? list : [];
}

export async function onRequestGet({ env }) {
  const shown = (await loadAll(env))
    .filter((r) => r.comment)
    .slice(0, MAX_SHOWN)
    .map(({ rating, name, comment, createdAt }) => ({ rating, name, comment, createdAt }));
  return json(shown, 200, { "Cache-Control": "public, max-age=30" });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }

  // Spam trap: real people never fill the hidden field. Pretend it worked.
  if (body.website) return json({ success: true });

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: "Please choose 1 to 5 stars." }, 400);
  const name = clean(body.name, 40);
  const comment = clean(body.comment, 300);
  if (/(https?:\/\/|www\.|\.com\b|\.in\b|\.net\b)/i.test(name + " " + comment)) return json({ error: "Links are not allowed in comments." }, 400);

  // One submission per visitor per minute.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rl = `RL-${ip}`;
  if (await env.BOOKINGS_KV.get(rl)) return json({ error: "Please wait a minute before sending another." }, 429);
  await env.BOOKINGS_KV.put(rl, "1", { expirationTtl: 60 });

  const review = { id: `FB-${Date.now()}-${(crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36)).slice(0, 4)}`, rating, name, comment, createdAt: new Date().toISOString() };
  const all = await loadAll(env);
  all.unshift(review);
  await env.BOOKINGS_KV.put(KEY, JSON.stringify(all.slice(0, MAX_KEPT)));

  // Telegram is best-effort; the review is already saved.
  try {
    if (env.TELEGRAM_TOKEN && env.TELEGRAM_CHAT_ID) {
      const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID, parse_mode: "HTML",
          text: `⭐ <b>New review ${rating}/5</b>${name ? " from " + esc(name) : ""}${comment ? "\n" + esc(comment) : ""}`,
        }),
      });
    }
  } catch (e) { console.log("Telegram failed", e); }
  return json({ success: true });
}
