SHINING BIKE RENTALS - Cloudflare Pages site
=============================================

FILES
  public/book.html     The website
  public/videos/       The 6 videos + their poster images (keep this folder next to book.html)
  public/index.html    Sends "/" to book.html
  public/admin.html    Password-protected dashboard (bookings table)
  functions/api/book.js            POST /api/book       (saves booking + Telegram alert)
  functions/api/feedback.js        POST /api/feedback   (star rating + Telegram alert)
  functions/api/admin/[[path]].js  GET/PUT/DELETE /api/admin/bookings
  wrangler.toml        Pages + KV config

VIDEOS
  book.html loads videos/hero.mp4, bike-aerox.mp4, bike-hunter.mp4, bike-ktm.mp4,
  route-dawki.mp4, route-guwahati.mp4 plus a matching .jpg poster for each.
  To swap a video, replace the file in public/videos/ using the SAME name.
  Cloudflare Pages allows files up to 25 MB each.

SETUP (all free tier)
  1. Create the KV namespace
       Dashboard: Workers & Pages > KV > Create namespace > name it BOOKINGS_KV
       or CLI:    npx wrangler kv namespace create BOOKINGS_KV
     Paste the id into wrangler.toml.
  2. Push this folder to GitHub.
  3. Workers & Pages > Create > Pages > Connect to Git.
       Build command: (leave empty)    Output directory: public
  4. Project > Settings > Bindings > Add > KV namespace
       Variable name: BOOKINGS_KV   Namespace: the one you created
  5. Project > Settings > Variables and Secrets: add (as secrets)
       TELEGRAM_TOKEN     token from @BotFather
       TELEGRAM_CHAT_ID   message your bot once, open
                          https://api.telegram.org/bot<TOKEN>/getUpdates
       ADMIN_PASSWORD     the password for /admin.html
  6. Redeploy. Site: /book.html   Dashboard: /admin.html

NOTES
  - The star rating card saves each rating in KV and sends a Telegram message.
  - The website currently has no booking form. /api/book and the dashboard
    are ready if you add one later.
  - Edit the Terms & Conditions pop-up text at the bottom of public/book.html
    (search for id="termsDlg"). It is generic wording, check it before use.
  - Page text is copied from the original design, including its typos.
