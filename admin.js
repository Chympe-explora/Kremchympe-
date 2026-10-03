/* ADMIN.JS — the logic behind admin.html. You never need to edit this file.
   Everything is saved on Website A (your Cloudflare Worker). Nothing secret lives here:
   the password is typed in, checked by Website A, and Website A hands back a 12-hour token. */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); };
  var API = ((window.TEXT && TEXT.backend && TEXT.backend.url) || '').replace(/\/+$/, '');
  var DEF = JSON.parse(JSON.stringify(window.TEXT));          /* the original words from site-text.js */
  var TKEY = 'kcAdminToken';
  var S = null;                                                /* what Website A has saved */
  var PRICE_DEF = null;                                        /* pricing.json */
  var E = {};                                                  /* unsaved text edits: path -> value */
  var P = null, pDirty = false;                                /* working copy of prices */
  var GL = { gallery: [], explore: [] }, gDirty = { gallery: false, explore: false };
  var FB = null;
  var tab = 'text';

  /* ---------- tiny helpers ---------- */
  function h(tag, o, kids) {
    var e = document.createElement(tag);
    o = o || {};
    Object.keys(o).forEach(function (k) {
      if (k === 'text') e.textContent = o[k];
      else if (k === 'class') e.className = o[k];
      else if (k === 'on') Object.keys(o.on).forEach(function (ev) { e.addEventListener(ev, o.on[ev]); });
      else if (k === 'style') e.style.cssText = o[k];
      else if (o[k] !== false && o[k] != null) e.setAttribute(k, o[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var clone = function (x) { return x === undefined ? undefined : JSON.parse(JSON.stringify(x)); };
  var same = function (a, b) { return JSON.stringify(a) === JSON.stringify(b); };
  function getPath(o, p) { return p.split('.').reduce(function (c, k) { return c == null ? undefined : c[k]; }, o); }
  function nice(k) { return k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, function (c) { return c.toUpperCase(); }); }
  var toastT;
  function say(msg, bad) {
    var t = $('toast'); t.textContent = msg; t.className = 'on' + (bad ? ' bad' : '');
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = ''; }, bad ? 6000 : 2800);
  }
  function token() { try { return sessionStorage.getItem(TKEY); } catch (e) { return null; } }
  function setToken(t) { try { if (t) sessionStorage.setItem(TKEY, t); else sessionStorage.removeItem(TKEY); } catch (e) {} }

  /* ---------- talking to Website A ---------- */
  function api(method, path, body) {
    var o = { method: method, headers: {} };
    if (token()) o.headers.Authorization = 'Bearer ' + token();
    if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
    return fetch(API + path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401 && token()) signedOut('Your session ended. Please sign in again.');
        if (!r.ok || j.ok === false) { var e = new Error(j.error || 'Something went wrong (' + r.status + ').'); e.status = r.status; e.data = j; throw e; }
        return j;
      });
    }, function () { throw new Error('Could not reach the server. Check your internet.'); });
  }
  function xhrUpload(file, label) {
    return new Promise(function (res, rej) {
      var x = new XMLHttpRequest();
      x.open('POST', API + '/api/cms/media');
      x.setRequestHeader('Authorization', 'Bearer ' + token());
      progress(label || 'Uploading…', 0);
      x.upload.onprogress = function (e) { if (e.lengthComputable) progress(label || 'Uploading…', Math.round(e.loaded / e.total * 100)); };
      x.onload = function () {
        var j = {}; try { j = JSON.parse(x.responseText); } catch (e) {}
        progress(null);
        if (x.status === 401) signedOut('Your session ended. Please sign in again.');
        if (x.status >= 200 && x.status < 300 && j.ok) res(j.media); else rej(new Error(j.error || 'Upload failed (' + x.status + ').'));
      };
      x.onerror = function () { progress(null); rej(new Error('Network problem while uploading.')); };
      var fd = new FormData(); fd.append('file', file, file.name); x.send(fd);
    });
  }
  function progress(msg, pct) {
    var p = $('prog');
    if (msg == null) { p.classList.add('hidden'); return; }
    p.classList.remove('hidden'); $('progMsg').textContent = msg + (pct != null ? ' ' + pct + '%' : ''); $('progBar').style.width = (pct || 0) + '%';
  }

  /* shrinks big phone photos in the browser (never QR codes: they must stay sharp) */
  function prep(file, keepSharp) {
    if (keepSharp || !/^image\/(jpeg|png|webp)$/.test(file.type)) return Promise.resolve(file);
    return new Promise(function (res) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        URL.revokeObjectURL(u);
        var s = Math.min(1, 2400 / Math.max(im.naturalWidth, im.naturalHeight));
        if (s === 1 && file.size < 1.5 * 1024 * 1024) return res(file);
        var c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        c.toBlob(function (b) {
          res(b && b.size < file.size ? new File([b], file.name.replace(/\.\w+$/, '') + (b.type === 'image/webp' ? '.webp' : '.jpg'), { type: b.type }) : file);
        }, 'image/webp', 0.85);
      };
      im.onerror = function () { res(file); };
      im.src = u;
    });
  }
  function pickFile(accept) {
    return new Promise(function (res) {
      var p = $('picker'); p.accept = accept; p.value = '';
      p.onchange = function () { res(p.files && p.files[0] || null); };
      p.click();
    });
  }
  function uploadPicked(kind, keepSharp) {
    var accept = kind === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp';
    return pickFile(accept).then(function (f) {
      if (!f) return null;
      if (kind === 'video' && f.size > 20 * 1024 * 1024) throw new Error('That video is over 20 MB. Please compress it first.');
      return prep(f, keepSharp).then(function (g) {
        return xhrUpload(g, 'Uploading ' + kind + '…');
      });
    }).then(function (m) { if (m) S.media.unshift(m); return m; });
  }
  function mediaById(id) { for (var i = 0; i < S.media.length; i++) if (S.media[i].id === id) return S.media[i]; return null; }
  function assetUrl(path) {
    var id = S.slots && S.slots[path], m = id && mediaById(id);
    return m ? m.url : path;
  }
  function refUrl(v, fallback) {
    if (typeof v === 'string' && /^media:/.test(v)) { var m = mediaById(v.slice(6)); return m ? m.url : ''; }
    return v ? assetUrl(v) : (fallback || '');
  }

  /* ---------- sign in / out ---------- */
  var challenge = null;
  function signedOut(msg) {
    setToken(null); S = null; challenge = null;
    ['top', 'tabs', 'app', 'savebar'].forEach(function (i) { $(i).classList.add('hidden'); });
    $('login').classList.remove('hidden'); $('stepPw').classList.remove('hidden'); $('stepCode').classList.add('hidden');
    $('pw').value = ''; $('code').value = ''; $('loginErr').textContent = msg || ''; $('loginBtn').textContent = 'Sign in';
  }
  $('loginForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = $('loginBtn'); btn.disabled = true; $('loginErr').textContent = '';
    var p = challenge ? api('POST', '/api/cms/verify', { challenge: challenge, code: $('code').value.trim() })
                      : api('POST', '/api/cms/login', { password: $('pw').value });
    p.then(function (j) {
      if (j.step === 'code') {
        challenge = j.challenge; $('stepPw').classList.add('hidden'); $('stepCode').classList.remove('hidden');
        btn.textContent = 'Verify'; $('code').focus(); $('loginErr').textContent = 'A 6-digit code was sent to your Telegram admin chat.';
        return;
      }
      setToken(j.token); $('pw').value = ''; $('code').value = ''; challenge = null; start();
    }).catch(function (e) {
      $('loginErr').textContent = e.message;
      if (challenge && (e.status === 401 && /expired|Start again/i.test(e.message))) signedOut(e.message);
    }).then(function () { btn.disabled = false; });
  });
  $('logout').addEventListener('click', function () {
    if (!confirm('Sign out everywhere? Every open dashboard session will end.')) return;
    api('POST', '/api/cms/logout').catch(function () {}).then(function () { signedOut('Signed out.'); });
  });

  /* ---------- start ---------- */
  function start() {
    $('login').classList.add('hidden'); ['top', 'tabs', 'app'].forEach(function (i) { $(i).classList.remove('hidden'); });
    Promise.all([
      api('GET', '/api/cms/state'),
      fetch('pricing.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).catch(function () { return null; })
    ]).then(function (r) {
      S = r[0]; PRICE_DEF = r[1]; if (PRICE_DEF) delete PRICE_DEF._README;
      E = {}; pDirty = false; gDirty = { gallery: false, explore: false };
      buildAll(); showTab(tab);
    }).catch(function (e) { if (token()) say(e.message, true); });
  }
  function buildAll() {
    $('ver').textContent = S.version && S.version !== '0' ? 'Live ✓' : '';
    renderText(); renderPrices(); renderGallery(); renderMedia();
  }

  /* ---------- tabs ---------- */
  function showTab(t) {
    tab = t;
    [].forEach.call(document.querySelectorAll('#tabs button'), function (b) { b.classList.toggle('on', b.dataset.tab === t); });
    ['text', 'prices', 'gallery', 'media', 'feedback'].forEach(function (n) { $('tab-' + n).classList.toggle('hidden', n !== t); });
    if (t === 'feedback') loadFeedback();
    updateBar(); window.scrollTo(0, 0);
  }
  $('tabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) showTab(b.dataset.tab); });

  /* ---------- the save bar (Text tab) ---------- */
  function updateBar() {
    var n = Object.keys(E).length, bar = $('savebar');
    var show = tab === 'text' && n > 0;
    bar.classList.toggle('hidden', !show);
    $('saveMsg').textContent = n + ' unsaved change' + (n === 1 ? '' : 's');
  }
  window.addEventListener('beforeunload', function (e) {
    if (Object.keys(E).length || pDirty || gDirty.gallery || gDirty.explore) { e.preventDefault(); e.returnValue = ''; }
  });
  $('discard').addEventListener('click', function () { E = {}; renderText(); updateBar(); });
  $('save').addEventListener('click', function () {
    var set = {}, unset = [];
    Object.keys(E).forEach(function (p) {
      if (same(E[p], getPath(DEF, p))) { if (Object.prototype.hasOwnProperty.call(S.content, p)) unset.push(p); }
      else set[p] = E[p];
    });
    var b = $('save'); b.disabled = true;
    api('PUT', '/api/cms/content', { set: set, unset: unset }).then(function (j) {
      S.content = j.content; S.version = j.version; E = {}; renderText(); updateBar(); renderMedia();
      say('Saved ✓ Visitors see it within a minute.');
    }).catch(function (e) { say(e.message, true); }).then(function () { b.disabled = false; });
  });

  /* ---------- TEXT tab ---------- */
  var SKIP = { 'home.gallery': 1, 'home.explore': 1, 'payment.qrImage': 1 };
  function collect(obj, path, out) {
    Object.keys(obj).forEach(function (k) {
      var p = path ? path + '.' + k : k, v = obj[k];
      if (!path && (k === 'backend' || k === 'admin')) return;
      if (SKIP[p]) return;
      if (typeof v === 'string') out.push({ path: p, kind: 'str' });
      else if (Array.isArray(v)) out.push({ path: p, kind: 'list' });
      else if (v && typeof v === 'object') collect(v, p, out);
    });
    return out;
  }
  function cur(path) {
    if (Object.prototype.hasOwnProperty.call(E, path)) return clone(E[path]);
    if (Object.prototype.hasOwnProperty.call(S.content, path)) return clone(S.content[path]);
    return clone(getPath(DEF, path));
  }
  function serverVal(path) { return Object.prototype.hasOwnProperty.call(S.content, path) ? S.content[path] : getPath(DEF, path); }
  function setText(path, val) {
    if (same(val, serverVal(path))) delete E[path]; else E[path] = val;
    updateBar();
  }
  function blankLike(x) {
    if (typeof x === 'string') return '';
    if (Array.isArray(x)) return x.map(blankLike);
    if (x && typeof x === 'object') { var o = {}; Object.keys(x).forEach(function (k) { o[k] = blankLike(x[k]); }); return o; }
    return x;
  }
  /* one editor for any value: text, a list of things, or a record of fields */
  function editor(val, set) {
    if (typeof val === 'string') {
      var multi = val.length > 60 || val.indexOf('\n') > -1;
      var f = multi ? h('textarea', { rows: Math.min(8, Math.max(2, val.split('\n').length + Math.floor(val.length / 70))) }) : h('input', { type: 'text' });
      f.value = val;
      f.addEventListener('input', function () { set(f.value); });
      return f;
    }
    if (Array.isArray(val)) {
      var box = h('div'); var arr = val.slice();
      var draw = function () {
        box.textContent = '';
        arr.forEach(function (item, i) {
          var inner = editor(item, function (nv) { arr[i] = nv; set(arr.slice()); });
          var ctl = h('div', { class: 'ctl' }, [
            h('button', { type: 'button', text: '↑', 'aria-label': 'Move up', disabled: i === 0 ? '' : false, on: { click: function () { var t = arr[i]; arr[i] = arr[i - 1]; arr[i - 1] = t; set(arr.slice()); draw(); } } }),
            h('button', { type: 'button', text: '↓', 'aria-label': 'Move down', disabled: i === arr.length - 1 ? '' : false, on: { click: function () { var t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t; set(arr.slice()); draw(); } } }),
            h('button', { type: 'button', text: '✕', 'aria-label': 'Remove', on: { click: function () { arr.splice(i, 1); set(arr.slice()); draw(); } } })
          ]);
          var pairish = Array.isArray(item) && item.every(function (x) { return typeof x === 'string'; });
          box.appendChild(h('div', { class: 'row' }, [h('div', { class: 'grow' + (pairish ? ' pair' : '') }, [inner]), ctl]));
        });
        box.appendChild(h('button', { type: 'button', class: 'pill sm', text: '+ Add', on: { click: function () { arr.push(arr.length ? blankLike(arr[arr.length - 1]) : ''); set(arr.slice()); draw(); } } }));
      };
      draw(); return box;
    }
    if (val && typeof val === 'object') {
      var rec = h('div', { class: 'sub' }); var o = clone(val);
      Object.keys(o).forEach(function (k) {
        rec.appendChild(h('label', { class: 'l', text: nice(k) }));
        rec.appendChild(editor(o[k], function (nv) { o[k] = nv; set(clone(o)); }));
      });
      return rec;
    }
    return h('span', { class: 'muted', text: String(val) });
  }
  function renderText() {
    var list = $('textList'), q = ($('q').value || '').trim().toLowerCase(), groups = {}, order = [];
    var open = {}; [].forEach.call(list.querySelectorAll('details[open]'), function (d) { open[d.dataset.g] = 1; });
    collect(DEF, '', []).forEach(function (f) {
      var parts = f.path.split('.'), g = parts[0] === 'packages' ? 'packages.' + parts[1] : parts[0];
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(f);
    });
    list.textContent = '';
    order.forEach(function (g) {
      var fields = groups[g].filter(function (f) {
        if (!q) return true;
        var v = JSON.stringify(cur(f.path)).toLowerCase();
        return f.path.toLowerCase().indexOf(q) > -1 || v.indexOf(q) > -1;
      });
      if (!fields.length) return;
      var edited = fields.filter(function (f) { return Object.prototype.hasOwnProperty.call(E, f.path) || Object.prototype.hasOwnProperty.call(S.content, f.path); }).length;
      var d = h('details', { class: 'grp', 'data-g': g }, [
        h('summary', {}, [h('span', { text: nice(g.replace('.', ' · ')) }), h('span', { class: 'n', text: fields.length + ' texts' + (edited ? ' · ' + edited + ' edited' : '') })])
      ]);
      if (q || open[g]) d.open = true;
      fields.forEach(function (f) {
        var isEdited = Object.prototype.hasOwnProperty.call(E, f.path) || Object.prototype.hasOwnProperty.call(S.content, f.path);
        var name = h('span', { class: 'nm', text: nice(f.path.split('.').pop()) }, [isEdited ? h('span', { class: 'badge', text: 'edited' }) : null]);
        var wrap = h('div', { class: 'fld' }, [
          h('div', { class: 'top' }, [
            h('div', {}, [name, h('div', { class: 'pth', text: f.path })]),
            isEdited ? h('button', { type: 'button', class: 'pill sm', text: '↩ Original', on: { click: function () { E[f.path] = clone(getPath(DEF, f.path)); if (same(E[f.path], serverVal(f.path))) delete E[f.path]; renderText(); updateBar(); } } }) : null
          ]),
          editor(cur(f.path), function (nv) { setText(f.path, nv); })
        ]);
        d.appendChild(wrap);
      });
      list.appendChild(d);
    });
    if (!list.firstChild) list.appendChild(h('p', { class: 'muted', text: 'Nothing matches that search.' }));
  }
  var qT; $('q').addEventListener('input', function () { clearTimeout(qT); qT = setTimeout(renderText, 200); });

  /* ---------- PRICES tab ---------- */
  var PL = { name: 'Name', adultPrice: 'Price per adult (₹)', childPrice: 'Price per child (₹) — empty = no children', minDaysAhead: 'Book at least this many days ahead', maxPeople: 'Most people in one booking', fromNight: 'Shown as "From ₹ / night"', minAdvance: 'Smallest advance a visitor can pay (₹)', label: 'Name shown to visitor', price: 'Price (₹)', unit: 'Charged', options: 'Options', items: 'Choices', packages: 'Packages', mandatory: 'Always included', custom: 'Show "Fully customisable"', mult: 'Charged per', requires: 'Only shows when this is ticked', id: 'Code name (do not change)' };
  function pnode(obj, key, onChange, path) {
    var v = obj[key], label = PL[key] || nice(key);
    if (typeof v === 'number' || v === null) {
      var orig = v;
      var inp = h('input', { type: 'number', min: '0', step: 'any', placeholder: v === null ? 'none' : '' }); inp.value = v === null ? '' : v;
      inp.addEventListener('input', function () { obj[key] = inp.value === '' ? (orig === null ? null : 0) : Number(inp.value); onChange(); });
      return h('div', {}, [h('label', { class: 'l', text: label }), inp]);
    }
    if (typeof v === 'boolean') {
      var cb = h('input', { type: 'checkbox' }); cb.checked = v;
      cb.addEventListener('change', function () { obj[key] = cb.checked; onChange(); });
      return h('label', { class: 'l', style: 'display:flex;gap:.5rem;align-items:center' }, [cb, label]);
    }
    if (typeof v === 'string') {
      if (key === 'unit') {
        var sel = h('select', {}, ['person', 'group'].map(function (o) { return h('option', { value: o, text: o === 'person' ? 'per person' : 'once per group' }); }));
        sel.value = v; sel.addEventListener('change', function () { obj[key] = sel.value; onChange(); });
        return h('div', {}, [h('label', { class: 'l', text: label }), sel]);
      }
      var t = h('input', { type: 'text', maxlength: '200' }); t.value = v;
      if (key === 'id' || key === 'requires' || key === 'mult') t.readOnly = true;
      t.addEventListener('input', function () { obj[key] = t.value; onChange(); });
      return h('div', {}, [h('label', { class: 'l', text: label }), t]);
    }
    if (Array.isArray(v)) {
      var box = h('div', { class: 'sub' }, [h('h3', { text: label, style: 'font-size:1rem;margin:.6rem 0 .2rem' })]);
      var draw = function () {
        while (box.childNodes.length > 1) box.removeChild(box.lastChild);
        v.forEach(function (it, i) {
          var card = h('div', { class: 'card', style: 'background:#f5f9fc;padding:.6rem;margin:.4rem 0' });
          if (it && typeof it === 'object') Object.keys(it).forEach(function (k) { card.appendChild(pnode(it, k, onChange, path + '.' + i)); });
          card.appendChild(h('button', { type: 'button', class: 'pill sm danger', text: 'Remove', style: 'margin-top:.5rem', on: { click: function () { v.splice(i, 1); onChange(); draw(); } } }));
          box.appendChild(card);
        });
        if (v.length && typeof v[0] === 'object') box.appendChild(h('button', { type: 'button', class: 'pill sm', text: '+ Add', on: { click: function () {
          var n = clone(v[v.length - 1]); if ('id' in n) n.id = 'new' + Math.random().toString(36).slice(2, 6); if ('label' in n) n.label = 'New item'; v.push(n); onChange(); draw(); } } }));
      };
      draw(); return box;
    }
    if (v && typeof v === 'object') {
      var g = h('div', { class: 'sub' });
      if (path.split('.').length >= 2 && v.name) g.appendChild(h('h3', { text: v.name, style: 'font-size:1.05rem;margin:.6rem 0 .1rem' }));
      Object.keys(v).forEach(function (k) { g.appendChild(pnode(v, k, onChange, path + '.' + k)); });
      return g;
    }
    return h('span');
  }
  function renderPrices() {
    var f = $('pricesForm'); f.textContent = '';
    var base = S.prices || PRICE_DEF;
    if (!base) { f.appendChild(h('p', { class: 'muted', text: 'pricing.json could not be loaded.' })); return; }
    P = clone(base); pDirty = false;
    f.appendChild(h('p', { class: 'muted', text: S.prices ? 'Showing your saved prices.' : 'Showing the prices from pricing.json (nothing saved yet).' }));
    var root = h('div'); root.appendChild(pnode(P, 'minAdvance', mark, 'minAdvance')); if ('maxPeople' in P) root.appendChild(pnode(P, 'maxPeople', mark, 'maxPeople'));
    root.appendChild(pnode(P, 'packages', mark, 'packages'));
    f.appendChild(root);
    function mark() { pDirty = true; }
  }
  $('pricesSave').addEventListener('click', function () {
    var b = $('pricesSave'); b.disabled = true;
    api('PUT', '/api/cms/prices', { prices: same(P, PRICE_DEF) ? null : P }).then(function (j) {
      S.prices = j.prices; S.version = j.version; renderPrices(); say('Prices saved ✓');
    }).catch(function (e) { say(e.message, true); }).then(function () { b.disabled = false; });
  });
  $('pricesReset').addEventListener('click', function () {
    if (!confirm('Go back to the prices in pricing.json?')) return;
    api('PUT', '/api/cms/prices', { prices: null }).then(function (j) { S.prices = null; S.version = j.version; renderPrices(); say('Prices reset ✓'); }).catch(function (e) { say(e.message, true); });
  });

  /* ---------- GALLERY tab ---------- */
  function renderGallery() {
    GL.gallery = clone(S.gallery || DEF.home.gallery || []);
    GL.explore = clone(S.explore || DEF.home.explore || []);
    gDirty = { gallery: false, explore: false };
    drawList('gallery'); drawList('explore');
  }
  function move(arr, i, d) { var t = arr[i]; arr[i] = arr[i + d]; arr[i + d] = t; }
  function drawList(kind) {
    var box = $(kind === 'gallery' ? 'galList' : 'exList'), arr = GL[kind]; box.textContent = '';
    if (!arr.length) box.appendChild(h('p', { class: 'muted', text: 'Nothing here yet.' }));
    arr.forEach(function (it, i) {
      var pic = it.image ? refUrl(it.image) : (it.video && !/^media:/.test(it.video) ? assetUrl('videos/' + it.video + '.jpg') : '');
      var thumb = h('div', { class: 'thumb', style: pic ? 'background-image:url("' + pic.replace(/"/g, '%22') + '")' : '' });
      var dirty = function () { gDirty[kind] = true; };
      var name = h('input', { type: 'text', maxlength: '60', placeholder: 'Name' }); name.value = it.name || ''; name.addEventListener('input', function () { it.name = name.value; dirty(); });
      var sub = h('input', { type: 'text', maxlength: '60', placeholder: 'Small second line' }); sub.value = it.sub || ''; sub.addEventListener('input', function () { it.sub = sub.value; dirty(); });
      var desc = h('textarea', { rows: '3', maxlength: '1000', placeholder: 'Description' }); desc.value = it.desc || ''; desc.addEventListener('input', function () { it.desc = desc.value; dirty(); });
      var pos = h('select', {}, [['50% 50%', 'Centre'], ['50% 20%', 'Top'], ['50% 80%', 'Bottom'], ['20% 50%', 'Left'], ['80% 50%', 'Right']].map(function (o) { return h('option', { value: o[0], text: 'Keep visible: ' + o[1] }); }));
      if (!Array.prototype.some.call(pos.options, function (o) { return o.value === it.pos; })) pos.appendChild(h('option', { value: it.pos || '50% 50%', text: 'Keep visible: custom (' + (it.pos || '50% 50%') + ')' }));
      pos.value = it.pos || '50% 50%'; pos.addEventListener('change', function () { it.pos = pos.value; dirty(); });
      var acts = h('div', { class: 'acts' }, [
        h('button', { type: 'button', class: 'pill sm', text: it.image || kind === 'gallery' ? 'Replace picture' : 'Add round picture', on: { click: function () {
          uploadPicked('image').then(function (m) { if (m) { it.image = 'media:' + m.id; dirty(); drawList(kind); say('Picture added. Tap Save when ready.'); } }).catch(function (e) { say(e.message, true); }); } } })
      ]);
      if (kind === 'explore') {
        var hasVid = it.video || it.videoUrl;
        var vtxt = !hasVid ? 'No video (picture only)' : /^media:/.test(it.video || '') ? 'Video: your upload' : 'Video: original (' + it.video + ')';
        acts.appendChild(h('button', { type: 'button', class: 'pill sm', text: hasVid ? 'Replace video' : 'Add video', on: { click: function () {
          uploadPicked('video').then(function (m) { if (m) { it.video = 'media:' + m.id; dirty(); drawList(kind); say(it.image ? 'Video added. Tap Save when ready.' : 'Video added. Also add a round picture, then Save.'); } }).catch(function (e) { say(e.message, true); }); } } }));
        acts.appendChild(h('span', { class: 'muted', text: vtxt, style: 'align-self:center' }));
      }
      acts.appendChild(h('span', { class: 'ctl' }, [
        h('button', { type: 'button', text: '↑', 'aria-label': 'Move up', disabled: i === 0 ? '' : false, on: { click: function () { move(arr, i, -1); dirty(); drawList(kind); } } }),
        h('button', { type: 'button', text: '↓', 'aria-label': 'Move down', disabled: i === arr.length - 1 ? '' : false, on: { click: function () { move(arr, i, 1); dirty(); drawList(kind); } } }),
        h('button', { type: 'button', text: '✕', 'aria-label': 'Remove', on: { click: function () { if (confirm('Remove "' + (it.name || 'this item') + '"?')) { arr.splice(i, 1); dirty(); drawList(kind); } } } })
      ]));
      box.appendChild(h('div', { class: 'item' }, [thumb, h('div', { class: 'body' }, [name, h('div', { style: 'height:.4rem' }), sub, h('div', { style: 'height:.4rem' }), desc, h('div', { style: 'height:.4rem' }), pos, acts])]));
    });
  }
  function saveList(kind) {
    var body = {}; body[kind] = GL[kind];
    var btn = $(kind === 'gallery' ? 'galSave' : 'exSave'); btn.disabled = true;
    api('PUT', '/api/cms/gallery', body).then(function (j) {
      S.gallery = j.gallery; S.explore = j.explore; S.version = j.version; renderGallery(); renderMedia(); say('Saved ✓');
    }).catch(function (e) { say(e.message, true); }).then(function () { btn.disabled = false; });
  }
  function resetList(kind) {
    if (!confirm('Go back to the original list from site-text.js?')) return;
    var body = {}; body[kind] = null;
    api('PUT', '/api/cms/gallery', body).then(function (j) { S.gallery = j.gallery; S.explore = j.explore; S.version = j.version; renderGallery(); renderMedia(); say('Reset ✓'); }).catch(function (e) { say(e.message, true); });
  }
  $('galSave').addEventListener('click', function () { saveList('gallery'); });
  $('exSave').addEventListener('click', function () { saveList('explore'); });
  $('galReset').addEventListener('click', function () { resetList('gallery'); });
  $('exReset').addEventListener('click', function () { resetList('explore'); });
  $('galAdd').addEventListener('click', function () {
    uploadPicked('image').then(function (m) { if (m) { GL.gallery.push({ name: 'New photo', sub: '', desc: '', pos: '50% 50%', image: 'media:' + m.id }); gDirty.gallery = true; drawList('gallery'); say('Added. Give it a name, then Save.'); } }).catch(function (e) { say(e.message, true); });
  });
  $('exAdd').addEventListener('click', function () {
    uploadPicked('image').then(function (m) { if (m) { GL.explore.push({ name: 'New scene', sub: '', desc: '', pos: '50% 50%', image: 'media:' + m.id }); gDirty.explore = true; drawList('explore'); say('Added. Name it (and add a video if you like), then Save.'); } }).catch(function (e) { say(e.message, true); });
  });

  /* ---------- PICTURES & VIDEOS tab ---------- */
  function knownAssets() {
    var out = [], seen = {};
    function add(path, label) { if (!seen[path]) { seen[path] = 1; out.push({ path: path, label: label }); } }
    (DEF.home.gallery || []).forEach(function (g) { if (g.image && !/^https?:/.test(g.image)) add(g.image, 'Gallery photo: ' + g.name); });
    (DEF.home.explore || []).forEach(function (x) {
      if (x.image && !/^https?:/.test(x.image)) add(x.image, 'Round picture: ' + x.name);
      if (x.video) { add('videos/' + x.video + '.mp4', 'Video: ' + x.name); add('videos/' + x.video + '.jpg', 'Video cover picture: ' + x.name); }
    });
    ['scene-1', 'scene-2', 'scene-3'].forEach(function (s, i) { add('videos/' + s + '.mp4', 'Package video ' + (i + 1)); add('videos/' + s + '.jpg', 'Package video ' + (i + 1) + ' cover picture'); });
    if (DEF.payment && DEF.payment.qrImage) add(DEF.payment.qrImage, 'Payment QR code');
    return out;
  }
  function putSlots(body) {
    return api('PUT', '/api/cms/slots', body).then(function (j) { S.slots = j.slots; S.version = j.version; renderMedia(); });
  }
  function renderMedia() {
    var box = $('assetList'); box.textContent = '';
    knownAssets().forEach(function (a) {
      var isVid = /\.(mp4|webm)$/i.test(a.path), replaced = S.slots && S.slots[a.path], url = assetUrl(a.path);
      var thumb = h('div', { class: 'thumb' }, [isVid ? h('video', { src: url, muted: '', playsinline: '', preload: 'metadata' }) : h('img', { src: url, alt: '' })]);
      var acts = h('div', { class: 'acts' }, [
        h('button', { type: 'button', class: 'pill sm', text: 'Upload new', on: { click: function () {
          uploadPicked(isVid ? 'video' : 'image', /qr/i.test(a.path)).then(function (m) { if (m) return putSlots({ set: (function () { var o = {}; o[a.path] = m.id; return o; })() }).then(function () { say('Replaced ✓ Visitors see it within a minute.'); }); }).catch(function (e) { say(e.message, true); });
        } } }),
        replaced ? h('button', { type: 'button', class: 'pill sm danger', text: 'Back to original', on: { click: function () { putSlots({ unset: [a.path] }).then(function () { say('Back to the original ✓'); }).catch(function (e) { say(e.message, true); }); } } }) : null
      ]);
      box.appendChild(h('div', { class: 'item' }, [thumb, h('div', { class: 'body' }, [h('div', { class: 'nm', text: a.label, style: 'font-weight:700' }), h('div', { class: 'muted', text: a.path + (replaced ? ' — replaced' : ' — original') }), acts])]));
    });
    var lib = $('libList'); lib.textContent = '';
    if (!S.media.length) lib.appendChild(h('p', { class: 'muted', text: 'No uploads yet.' }));
    S.media.forEach(function (m) {
      var thumb = h('div', { class: 'thumb' }, [m.type === 'video' ? h('video', { src: m.url, muted: '', playsinline: '', preload: 'metadata' }) : h('img', { src: m.url, alt: '', loading: 'lazy' })]);
      lib.appendChild(h('div', { class: 'item' }, [thumb, h('div', { class: 'body' }, [
        h('div', { class: 'nm', text: m.name, style: 'font-weight:700;word-break:break-all' }),
        h('div', { class: 'muted', text: m.type + ' · ' + Math.round(m.size / 1024) + ' KB · ' + new Date(m.ts).toLocaleDateString() }),
        h('div', { class: 'acts' }, [
          h('button', { type: 'button', class: 'pill sm', text: 'Copy link', on: { click: function () { (navigator.clipboard ? navigator.clipboard.writeText(m.url) : Promise.reject()).then(function () { say('Link copied'); }, function () { say(m.url); }); } } }),
          h('button', { type: 'button', class: 'pill sm danger', text: 'Delete', on: { click: function () {
            if (!confirm('Delete this file for good?')) return;
            api('DELETE', '/api/cms/media/' + m.id).then(function () { S.media = S.media.filter(function (x) { return x.id !== m.id; }); renderMedia(); say('Deleted'); }).catch(function (e) { say(e.message, true); });
          } } })
        ])
      ])]));
    });
  }

  /* ---------- FEEDBACK tab ---------- */
  function loadFeedback() {
    api('GET', '/api/cms/feedback').then(function (j) { FB = j.feedback; renderFeedback(); }).catch(function (e) { say(e.message, true); });
  }
  function act(id, action) {
    api('POST', '/api/cms/feedback/' + id, { action: action }).then(loadFeedback).catch(function (e) { say(e.message, true); });
  }
  function renderFeedback() {
    var box = $('fbList'); box.textContent = '';
    var vis = FB.filter(function (r) { return !r.hidden; });
    var avg = vis.length ? (vis.reduce(function (s, r) { return s + (Number(r.rating) || 0); }, 0) / vis.length).toFixed(1) : '–';
    $('fbTitle').textContent = 'Feedback (' + FB.length + ') · average ' + avg;
    if (!FB.length) box.appendChild(h('p', { class: 'muted', text: 'No feedback yet.' }));
    FB.forEach(function (r) {
      var stars = '★★★★★'.slice(0, r.rating) + '☆☆☆☆☆'.slice(0, 5 - r.rating);
      var photos = (r.photoUrls || []).length ? h('div', { class: 'photos' }, r.photoUrls.map(function (u) { return h('a', { href: u, target: '_blank', rel: 'noopener', style: 'background-image:url("' + u.replace(/"/g, '%22') + '")', 'aria-label': 'Open photo' }); })) : null;
      box.appendChild(h('div', { class: 'card' }, [
        h('div', {}, [h('span', { class: 'stars', text: stars }), h('b', { text: ' ' + (r.name || 'Visitor') }), r.pinned ? h('span', { class: 'flag', text: 'pinned' }) : null, r.hidden ? h('span', { class: 'flag', text: 'hidden' }) : null]),
        h('div', { class: 'muted', text: r.ts ? new Date(r.ts).toLocaleString() : '' }),
        r.comment ? h('p', { text: r.comment, style: 'margin:.5rem 0;white-space:pre-wrap;word-break:break-word' }) : null,
        photos,
        h('div', { class: 'acts', style: 'margin-top:.6rem' }, [
          h('button', { type: 'button', class: 'pill sm', text: r.hidden ? 'Show on site' : 'Hide from site', on: { click: function () { act(r.id, r.hidden ? 'show' : 'hide'); } } }),
          h('button', { type: 'button', class: 'pill sm', text: r.pinned ? 'Unpin' : 'Pin to top', on: { click: function () { act(r.id, r.pinned ? 'unpin' : 'pin'); } } }),
          h('button', { type: 'button', class: 'pill sm danger', text: 'Delete', on: { click: function () {
            if (!confirm('Delete this feedback' + ((r.photoUrls || []).length ? ' and its photos' : '') + ' for good?')) return;
            api('DELETE', '/api/cms/feedback/' + r.id).then(loadFeedback).catch(function (e) { say(e.message, true); });
          } } })
        ])
      ]));
    });
  }
  $('fbRefresh').addEventListener('click', loadFeedback);

  /* ---------- go ---------- */
  if (!API) { $('loginErr').textContent = 'No backend address in site-text.js (backend.url).'; $('loginBtn').disabled = true; }
  else if (token()) { start(); }
})();
