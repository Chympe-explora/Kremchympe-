/* FX.JS — extra movement for every page: button ripples, number count-up, page-to-page slides, option reveals,
   staggered rows, shake on errors, success checkmark. It only adds motion; it never changes words, prices or booking logic.
   Visitors with "reduce motion" switched on see none of it. */
(function () {
  var d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STAG = function (sel, n, ms, anim) { var o = ''; for (var i = 1; i <= n; i++) o += sel + ':nth-child(' + i + '){animation-delay:' + (i * ms) + 'ms}'; return o; };
  var css = '@media (prefers-reduced-motion:no-preference){' +
    '@keyframes fxUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}' +
    '@keyframes fxPop{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}' +
    '@keyframes fxFwd{from{opacity:0;transform:translateX(42px)}to{opacity:1;transform:none}}' +
    '@keyframes fxBack{from{opacity:0;transform:translateX(-42px)}to{opacity:1;transform:none}}' +
    '@keyframes fxDrop{from{opacity:0;transform:translateY(-10px) scaleY(.85);transform-origin:top}to{opacity:1;transform:none}}' +
    '@keyframes fxBump{0%{transform:scale(1)}40%{transform:scale(1.28)}100%{transform:scale(1)}}' +
    '@keyframes fxShake{0%,100%{transform:none}20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}' +
    '@keyframes fxRip{to{transform:scale(1);opacity:0}}' +
    '@keyframes fxRing{from{transform:scale(.4);opacity:.95}to{transform:scale(7);opacity:0}}' +
    '@keyframes fxCheck{from{opacity:0;transform:scale(0) rotate(-120deg)}to{opacity:1;transform:none}}' +
    '.fx-r{position:relative;overflow:hidden}' +
    '.fx-ripple{position:absolute;border-radius:50%;background:currentColor;opacity:.25;transform:scale(0);animation:fxRip .65s ease-out forwards;pointer-events:none}' +
    '.fx-ring{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 12px rgba(255,255,255,.6);pointer-events:none;z-index:3;animation:fxRing .75s ease-out forwards}' +
    '.bump{animation:fxBump .4s cubic-bezier(.3,1.6,.5,1)}' +
    '[aria-invalid="true"]{animation:fxShake .45s}' +
    /* booking pages */
    '.step.show{animation:fxFwd .5s cubic-bezier(.2,.8,.2,1)}.app.back .step.show{animation-name:fxBack}' +
    '.steps i{transition:background .35s,color .35s,transform .35s}.steps i.on{transform:scale(1.2);animation:fxPop .45s}.steps i.done{background:var(--main);color:#fff}' +
    '.steps b{position:relative;overflow:hidden;background:rgba(63,122,163,.28)}.steps b::after{content:"";position:absolute;inset:0;background:var(--main);transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.2,.8,.2,1)}.steps b.done::after{transform:none}' +
    '.opt{transition:border-color .25s,background .25s,transform .2s,box-shadow .25s}.opt:active{transform:scale(.985)}.opt.on{box-shadow:0 6px 16px rgba(63,122,163,.16)}.opt input:checked{animation:fxPop .35s}' +
    '.fresh{animation:fxDrop .45s cubic-bezier(.2,.8,.2,1) backwards}.fresh .it{animation:fxUp .4s backwards}' + STAG('.fresh .it', 6, 60) +
    '#pickList button{animation:fxUp .55s backwards}' + STAG('#pickList button', 5, 90) +
    '.inv tr{animation:fxUp .45s backwards}' + STAG('.inv tr', 10, 60) +
    '.os p,.os h3{animation:fxUp .4s backwards}' + STAG('.os p', 5, 70) +
    '.pane.on{animation:fxPop .4s}.tabs button{transition:background .25s,color .25s,transform .15s}.tabs button:active{transform:scale(.95)}' +
    '#rcPrev img,#rcPrev canvas{animation:fxPop .5s}' +
    '.stp output,.q output,.est b,.bal b{display:inline-block}' +
    '.btn{transition:background .2s,transform .2s,box-shadow .2s}@media(hover:hover){.btn:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.14)}}' +
    '.done{animation:fxPop .7s}.done .h::before{content:"\\2713";display:grid;place-items:center;width:3.4rem;height:3.4rem;margin:0 auto .8rem;border-radius:50%;background:var(--main);color:#fff;font:700 1.8rem Arial,sans-serif;animation:fxCheck .8s .15s cubic-bezier(.2,.9,.3,1.3) backwards}' +
    /* policy + owner pages */
    '.cl{animation:fxUp .6s backwards}' + STAG('.cl', 8, 90) +
    '#login{animation:fxPop .6s}#dash:not(.hidden){animation:fxUp .5s}tbody tr{animation:fxUp .4s backwards}' + STAG('tbody tr', 12, 45) +
    '.pill,.btn,.submit{-webkit-tap-highlight-color:transparent}' +
    '}';
  var st = d.createElement('style'); st.textContent = css; (d.head || d.documentElement).appendChild(st);
  if (reduce) { window.fxNum = function (el, to, f) { if (el) el.textContent = (f || window.inr || String)(to); }; window.fxBump = window.fxRing = function () {}; return; }

  /* press ripple on every rectangular button */
  var SEL = '.pill,.btn,.fleet-btn,.submit,.vw-res,.rv-nav button,.ex-mode button,.tabs button,.stp button,.q button,.gal-nav button';
  d.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest(SEL); if (!b || b.disabled) return;
    b.classList.add('fx-r');
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, i = d.createElement('i');
    i.className = 'fx-ripple';
    i.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    b.appendChild(i); setTimeout(function () { i.remove(); }, 700);
  }, { passive: true });

  /* ring that shows where you tapped (used for the hero triple-tap) */
  window.fxRing = function (x, y, host) {
    var r = host.getBoundingClientRect(), i = d.createElement('i'); i.className = 'fx-ring';
    i.style.left = (x - r.left) + 'px'; i.style.top = (y - r.top) + 'px'; host.appendChild(i);
    setTimeout(function () { i.remove(); }, 800);
  };
  /* numbers count up/down to their new value */
  var last = {};
  window.fxNum = function (el, to, fmt, from) {
    if (!el) return; fmt = fmt || window.inr || String;
    var k = el.id || 'k', f = from != null ? from : (last[k] == null ? to : last[k]); last[k] = to;
    if (f === to) { el.textContent = fmt(to); return; }
    var t0 = performance.now(), dur = 550;
    (function step(t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(f + (to - f) * e)); if (p < 1) requestAnimationFrame(step); })(t0);
  };
  window.fxBump = function (el) { if (!el) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };
})();
