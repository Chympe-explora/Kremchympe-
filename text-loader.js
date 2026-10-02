/* TEXT-LOADER.JS — fills the pages with the words from site-text.js.
   You never need to edit this file. */
(function () {
  function look(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, window.TEXT);
  }
  function fmt(s, vars) {
    return s.replace(/\{([\w.]+)\}/g, function (m, k) {
      if (vars && Object.prototype.hasOwnProperty.call(vars, k)) return vars[k];
      var r = look(k);
      return (r == null || typeof r === 'object') ? m : String(r);
    });
  }
  /* T('home.bookNow')  or  T('booking.errAdvance', {min:'₹1,000', max:'₹5,000'}) */
  window.T = function (key, vars) {
    var v = look(key);
    if (v == null || typeof v === 'object') return '[[' + key + ']]';
    return fmt(String(v), vars);
  };
  /* Puts text in an element; "\n" becomes a line break. Never inserts HTML. */
  window.setText = function (el, s) {
    el.textContent = '';
    String(s).split('\n').forEach(function (line, i) {
      if (i) el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode(line));
    });
  };
  window.inr = function (n) { return T('common.currency') + Number(n).toLocaleString('en-IN'); };
  window.applyText = function (root) {
    [].forEach.call(root.querySelectorAll('[data-t]'), function (el) { setText(el, T(el.getAttribute('data-t'))); });
    /* data-ta="attribute=template|attribute=template" */
    [].forEach.call(root.querySelectorAll('[data-ta]'), function (el) {
      el.getAttribute('data-ta').split('|').forEach(function (pair) {
        var i = pair.indexOf('=');
        if (i > 0) el.setAttribute(pair.slice(0, i).trim(), fmt(pair.slice(i + 1)));
      });
    });
  };
  window.applyText(document);
})();
