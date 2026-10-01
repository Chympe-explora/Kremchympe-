// Admin API (catch-all route):
//   GET    /api/admin/bookings        list all
//   PUT    /api/admin/bookings/:id    update status
//   DELETE /api/admin/bookings/:id    delete
// All require:  Authorization: Bearer <ADMIN_PASSWORD>

const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Constant-time comparison so response timing doesn't leak the password.
function safeEqual(a, b) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

function authorized(request, env) {
  const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  return !!env.ADMIN_PASSWORD && safeEqual(token, env.ADMIN_PASSWORD);
}

async function listBookings(kv) {
  const keys = [];
  let cursor;
  do {
    const page = await kv.list({ prefix: "BKG-", cursor });
    keys.push(...page.keys);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  const rows = await Promise.all(keys.map((k) => kv.get(k.name, "json")));
  return rows.filter(Boolean).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function onRequest({ request, env, params }) {
  if (!authorized(request, env)) return json({ error: "Unauthorized" }, 401);

  const [resource, id] = [].concat(params.path || []);
  if (resource !== "bookings") return json({ error: "Not found" }, 404);
  const kv = env.BOOKINGS_KV;

  if (request.method === "GET" && !id) return json(await listBookings(kv));

  if (id && request.method === "PUT") {
    const booking = await kv.get(id, "json");
    if (!booking) return json({ error: "Booking not found" }, 404);
    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
    if (!STATUSES.includes(body.status)) return json({ error: "Invalid status" }, 400);
    booking.status = body.status;
    booking.updatedAt = new Date().toISOString();
    await kv.put(id, JSON.stringify(booking));
    return json(booking);
  }

  if (id && request.method === "DELETE") {
    await kv.delete(id);
    return json({ success: true });
  }

  return json({ error: "Method not allowed" }, 405);
}
