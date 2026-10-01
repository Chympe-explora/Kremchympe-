// POST /api/feedback  { rating: 1-5 }  — stores the rating in KV and pings Telegram.
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: "Rating must be 1 to 5." }, 400);

  const id = `FB-${Date.now()}-${(crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36)).slice(0, 4)}`;
  await env.BOOKINGS_KV.put(id, JSON.stringify({ id, rating, createdAt: new Date().toISOString() }));

  // Telegram is best-effort; the rating is already saved.
  try {
    if (env.TELEGRAM_TOKEN && env.TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: `⭐ New rating: ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)` }),
      });
    }
  } catch (e) { console.log("Telegram failed", e); }
  return json({ success: true });
}
