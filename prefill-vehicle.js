/* Add to reserve.html, just before </body>:   <script src="prefill-vehicle.js"></script>
   Fills the vehicle field from the link the visitor tapped (reserve.html?vehicle=KTM%20Duke%20200). */
(function(){
  var name='';
  try{name=new URLSearchParams(location.search).get('vehicle')||sessionStorage.getItem('shiningVehicle')||''}catch(e){}
  name=name.trim();if(!name)return;
  var KEY=/vehicle|bike|scoot|ride|model/i,tries=0;
  function norm(x){return String(x||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
  function fire(el){['input','change'].forEach(function(t){el.dispatchEvent(new Event(t,{bubbles:true}))})}
  function fill(){
    var fields=[].slice.call(document.querySelectorAll('select,input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=date]):not([type=tel]):not([type=email]),input[type=hidden][name*=ehicle],input[type=hidden][name*=ike]'));
    for(var i=0;i<fields.length;i++){
      var el=fields[i],tag=[el.name,el.id,el.placeholder,el.getAttribute('aria-label'),(el.labels&&el.labels[0]?el.labels[0].textContent:'')].join(' ');
      if(!KEY.test(tag))continue;
      if(el.tagName==='SELECT'){
        var want=norm(name),hit=null;
        [].forEach.call(el.options,function(o){if(!hit&&(norm(o.value)===want||norm(o.textContent)===want))hit=o});
        if(!hit)[].forEach.call(el.options,function(o){if(!hit&&want&&(norm(o.textContent).indexOf(want)>-1||want.indexOf(norm(o.textContent))>-1&&norm(o.textContent).length>3))hit=o});
        if(!hit){hit=new Option(name,name);el.add(hit)}
        el.value=hit.value;
      } else el.value=name;
      fire(el);return true;
    }
    return false;
  }
  function go(){if(fill()||++tries>20)return;setTimeout(go,250)}   /* retries in case the form is drawn by script */
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
