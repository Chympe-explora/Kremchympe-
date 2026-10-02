/* MOTION.JS — page transitions, split-text headings, scroll progress bar and parallax.
   It only adds movement. It never changes your words, prices or the booking logic.
   Visitors who have "reduce motion" switched on in their phone/computer see none of it. */
(function () {
  var d = document, root = d.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('anim', 'pt-pre');

  var label = (window.TEXT && TEXT.common && TEXT.common.loaderText) || '';
  var css = [
    /* ---- page curtain (opens when a page loads, closes before the next page) ---- */
    'html.pt-pre::after,html.pt-leave::after{content:' + JSON.stringify(label) + ';position:fixed;inset:0;z-index:99999;display:grid;place-items:center;',
    'background:linear-gradient(160deg,#17394f,#3f7aa3);color:#fff;font:600 clamp(.8rem,3vw,1.1rem) Jost,Arial,sans-serif;letter-spacing:.55em;text-transform:uppercase;text-indent:.55em}',
    'html.pt-go::after{animation:ptUp .7s .2s cubic-bezier(.76,0,.24,1) forwards}',
    '@keyframes ptUp{to{transform:translateY(-101%);visibility:hidden}}',
    'html.pt-leave::after{animation:ptIn .48s cubic-bezier(.76,0,.24,1) forwards}',
    '@keyframes ptIn{from{transform:translateY(101%)}to{transform:none}}',
    /* ---- split-text headings: words rise out of a mask one after another ---- */
    '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '.anim .split .w{display:inline-block;overflow:hidden;vertical-align:top;padding:.08em .04em .16em;margin:-.08em -.04em -.16em}',
    '.anim .split .wi{display:inline-block;opacity:0;transform:translateY(115%) rotate(5deg);transform-origin:0 100%;filter:blur(3px);',
    'transition:transform 1s cubic-bezier(.2,.8,.2,1),opacity .8s ease,filter .8s ease;transition-delay:calc(var(--i)*75ms + var(--sd,0ms))}',
    '.anim .split.split-in .wi{opacity:1;transform:none;filter:none}',
    /* ---- scroll progress bar ---- */
    '#scrollbar{position:fixed;left:0;top:0;right:0;height:3px;z-index:90;transform:scaleX(0);transform-origin:0 50%;pointer-events:none;',
    'background:linear-gradient(90deg,#6fcfe0,#3f7aa3);box-shadow:0 0 8px rgba(111,207,224,.6)}'
  ].join('');
  var st = d.createElement('style'); st.textContent = css; (d.head || root).appendChild(st);

  /* ---- ready: curtain lifts, then everything else animates in ---- */
  var started = false, isReady = false, pending = [];
  function ready() {
    if (isReady) return; isReady = true; root.classList.add('ready');
    pending.splice(0).forEach(function (f) { f(); });
  }
  function go() { if (started) return; started = true; root.classList.add('pt-go'); setTimeout(ready, 450); }
  window.whenReady = function (fn) { if (isReady) fn(); else pending.push(fn); };
  root.addEventListener('animationend', function (e) {
    if (e.animationName === 'ptUp') root.classList.remove('pt-pre', 'pt-go');
  });
  function boot() {
    var t = setTimeout(go, 700);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { clearTimeout(t); go(); });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
  setTimeout(go, 4000);                                   /* safety: never leave the curtain down */

  /* ---- leaving: curtain closes, then the next page opens ---- */
  var leaving = false;
  function leave(url) {
    if (leaving) return; leaving = true;
    root.classList.remove('pt-pre', 'pt-go'); root.classList.add('pt-leave');
    setTimeout(function () { location.href = url; }, 480);
  }
  d.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(javascript|mailto|tel|sms|whatsapp|data):/i.test(h)) return;
    var u; try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault(); leave(u.href);
  });
  addEventListener('pageshow', function (e) {               /* back button: page comes from cache */
    if (!e.persisted) return;
    leaving = false; root.classList.remove('pt-leave', 'pt-pre', 'pt-go'); root.classList.add('ready');
  });

  /* ---- after the page is built: split headings, progress bar, parallax ---- */
  function build() {
    var els = [].slice.call(d.querySelectorAll('[data-split]'));
    els.forEach(function (el) {
      if (el.classList.contains('split')) return;
      var ok = [].every.call(el.childNodes, function (n) { return n.nodeType === 3 || n.nodeName === 'BR'; });
      if (!ok) return;
      var i = 0, txt = '', vis = d.createElement('span'), sr = d.createElement('span');
      vis.className = 'sp'; vis.setAttribute('aria-hidden', 'true'); sr.className = 'sr';
      [].slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.nodeValue.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { vis.appendChild(d.createTextNode(' ')); txt += ' '; return; }
            var w = d.createElement('span'), wi = d.createElement('span');
            w.className = 'w'; wi.className = 'wi'; wi.textContent = p; wi.style.setProperty('--i', i++);
            w.appendChild(wi); vis.appendChild(w); txt += p;
          });
        } else { vis.appendChild(d.createElement('br')); txt += ' '; }
      });
      sr.textContent = txt.replace(/\s+/g, ' ').trim();
      el.textContent = ''; el.appendChild(sr); el.appendChild(vis); el.classList.add('split');
    });
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        window.whenReady(function () { e.target.classList.add('split-in'); });
      });
    }, { threshold: .3 }) : null;
    d.querySelectorAll('[data-split]').forEach(function (el) {
      if (el.getAttribute('data-split') === 'hero' || !io) window.whenReady(function () { setTimeout(function () { el.classList.add('split-in'); }, 250); });
      else io.observe(el);
    });

    var bar = d.createElement('div'); bar.id = 'scrollbar'; bar.setAttribute('aria-hidden', 'true'); d.body.appendChild(bar);
    var par = [].map.call(d.querySelectorAll('[data-parallax]'), function (el) {
      return { el: el, k: parseFloat(el.getAttribute('data-parallax')) || 0, fade: el.hasAttribute('data-fade') };
    });
    var tick = false;
    function onScroll() {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var y = window.pageYOffset, vh = innerHeight, max = Math.max(1, root.scrollHeight - vh);
        bar.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
        if (y > vh * 1.3) return;
        par.forEach(function (p) {
          p.el.style.translate = '0 ' + (y * p.k).toFixed(1) + 'px';
          if (p.fade) p.el.style.opacity = y < 2 ? '' : Math.max(0, 1 - y / (vh * .7)).toFixed(3);
        });
      });
    }
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', build); else build();
})();
