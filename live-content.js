/* LIVE-CONTENT.JS — pulls your dashboard edits from Website A on every page load.
   You never need to edit this file.

   Load order on every page:  site-text.js  ->  live-content.js  ->  (the rest)

   How it stays fast AND live:
   1. The last content Website A sent is kept in this browser (localStorage), so the page paints
      instantly with the newest words/pictures it knows about.
   2. Every page load also asks Website A "what's the latest?". If something changed, it is saved
      and the page refreshes itself once (only if the visitor isn't typing).
   3. While a page stays open it checks again every minute and shows a small
      "New content available" bar instead of yanking the page away.

   If Website A is unreachable, the page simply shows site-text.js / pricing.json as before. */
(function () {
  var T = window.TEXT;
  if (!T) return;
  var BACKEND = ((T.backend && T.backend.url) || '').replace(/\/+$/, '');
  var KEY = 'kc_cms_v1', GUARD = 'kc_cms_rl';
  var POLL_MS = 60000;
  var DENY = /^(backend|admin)(\.|$)/;           /* these can never be changed from the dashboard */
  var BAD = { '__proto__': 1, 'constructor': 1, 'prototype': 1 };

  window.CMS = { version: '0', prices: null, slots: {} };
  /* M('videos/scene-1.mp4') -> the replacement uploaded in the dashboard, or the same path if none */
  window.M = function (p) { return (window.CMS.slots && window.CMS.slots[p]) || p; };

  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardGet() { try { return sessionStorage.getItem(GUARD); } catch (e) { return null; } }
  function guardSet(v) { try { sessionStorage.setItem(GUARD, v); } catch (e) {} }

  function setPath(root, path, val) {
    var parts = path.split('.'), cur = root, i;
    for (i = 0; i < parts.length; i++) if (BAD[parts[i]]) return;
    for (i = 0; i < parts.length - 1; i++) {
      var k = parts[i];
      if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function apply(d) {
    if (!d || typeof d !== 'object') return;
    var c = d.content || {};
    Object.keys(c).forEach(function (p) { if (!DENY.test(p)) setPath(T, p, c[p]); });
    T.home = T.home || {};
    if (Array.isArray(d.gallery)) T.home.gallery = d.gallery;
    if (Array.isArray(d.explore)) T.home.explore = d.explore;
    window.CMS.prices = d.prices && d.prices.packages ? d.prices : null;
    window.CMS.slots = d.slots || {};
    window.CMS.version = String(d.version || '0');
    /* pictures that were replaced in the dashboard (same file name, new picture) */
    ['gallery', 'explore'].forEach(function (k) {
      (T.home[k] || []).forEach(function (it) { if (it && typeof it.image === 'string') it.image = window.M(it.image); });
    });
    if (T.payment && typeof T.payment.qrImage === 'string') T.payment.qrImage = window.M(T.payment.qrImage);
  }

  var cachedRaw = load(KEY), cached = null;
  try { cached = cachedRaw ? JSON.parse(cachedRaw) : null; } catch (e) { cached = null; }
  apply(cached);

  if (!BACKEND || !window.fetch) return;

  /* First ever visit (nothing saved yet): keep the page hidden for a moment so nobody sees
     the old words flash before the real ones. Never longer than 2.5 seconds. */
  var hidden = false;
  function show() { if (hidden) { document.documentElement.style.visibility = ''; hidden = false; } }
  if (!cached) { document.documentElement.style.visibility = 'hidden'; hidden = true; setTimeout(show, 2500); }

  function getJson(path) {
    return fetch(BACKEND + path, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw 0; return r.json(); });
  }
  function safeToReload() {
    var a = document.activeElement, t = a && a.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return false;
    return (window.performance && performance.now() < 6000);       /* only right after the page opened */
  }

  function bar(msg, action) {
    if (document.getElementById('kcCmsBar')) return;
    var b = document.createElement('div');
    b.id = 'kcCmsBar'; b.setAttribute('role', 'status');
    b.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:99999;background:#111;color:#fff;border-radius:999px;padding:.6rem 1.1rem;font:700 .85rem system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.35);cursor:pointer;max-width:92vw;text-align:center';
    b.textContent = msg; b.addEventListener('click', action);
    (document.body || document.documentElement).appendChild(b);
  }

  getJson('/api/siteb/content').then(function (d) {
    if (!d || !d.ok) return show();
    var ver = String(d.version || '0');
    var saved = store(KEY, JSON.stringify(d));
    if (cached && String(cached.version) === ver) return show();          /* nothing new */
    if (!cached && ver === '0') return show();                             /* nothing edited yet */
    if (!saved || guardGet() === ver) return show();                       /* can't save here, or already refreshed once */
    if (!cached || safeToReload()) { guardSet(ver); location.reload(); return; }
    show();
    bar('New content available — tap to refresh', function () { guardSet(ver); location.reload(); });
  }).catch(show);

  var seen = window.CMS.version;
  setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    getJson('/api/siteb/version').then(function (v) {
      if (!v || !v.ok || String(v.version) === seen) return;
      getJson('/api/siteb/content').then(function (d) {
        if (!d || !d.ok) return;
        store(KEY, JSON.stringify(d));
        var ver = String(d.version || '0');
        seen = ver;
        bar('New content available — tap to refresh', function () { guardSet(ver); location.reload(); });
      });
    }).catch(function () {});
  }, POLL_MS);
})();
