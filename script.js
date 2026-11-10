(function(){'use strict';
var d=document,root=d.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
var $=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var PHONE='919847049303',EMAIL='skconventioncenter@gmail.com';
/* intro loader — once per session */
var loader=$('.loader');
if(loader){var seen=false;try{seen=sessionStorage.getItem('skccIntro')==='1'}catch(e){}
 var hide=function(){loader.classList.add('done');setTimeout(function(){loader.remove()},1200)};
 if(seen||reduced)hide();else{try{sessionStorage.setItem('skccIntro','1')}catch(e){}
  var t=setTimeout(hide,2600);addEventListener('load',function(){clearTimeout(t);setTimeout(hide,1500)},{once:true})}}
/* header + menu */
var header=$('.site-header'),burger=$('.burger'),menu=$('.menu');
function onScroll(){if(header)header.classList.toggle('scrolled',scrollY>30);parallax()}
function setMenu(o){root.classList.toggle('menu-open',o);d.body.classList.toggle('menu-open',o);if(burger){burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu')}if(menu)menu.setAttribute('aria-hidden',!o)}
if(burger)burger.addEventListener('click',function(){setMenu(!root.classList.contains('menu-open'))});
d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
$$('.menu a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
addEventListener('resize',function(){if(innerWidth>900)setMenu(false)});
/* parallax hero */
var media=$('.hero-media'),ticking=false;
function parallax(){if(reduced||!media)return;if(ticking)return;ticking=true;requestAnimationFrame(function(){var m=$('.page:not([hidden]) .hero-media')||media;if(scrollY<1400)m.style.setProperty('--py',(scrollY*.16)+'px');ticking=false})}
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* reveal + counters */
function count(el){var end=parseFloat(el.dataset.count),suf=el.dataset.suffix||'',dur=1800,s=null;
 if(reduced){el.textContent=end+suf;return}
 (function step(ts){if(!s)s=ts;var p=Math.min((ts-s)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(end*e)+(p<1?'':suf);if(p<1)requestAnimationFrame(step)})(performance.now())}
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;en.target.classList.add('in');$$('[data-count]',en.target).concat(en.target.matches('[data-count]')?[en.target]:[]).forEach(function(c){if(!c.dataset.done){c.dataset.done=1;count(c)}});io.unobserve(en.target)})},{threshold:.15,rootMargin:'0px 0px -6% 0px'}):null;
function observe(){$$('.rv').forEach(function(el){if(el.classList.contains('in'))return;if(io)io.observe(el);else{el.classList.add('in');$$('[data-count]',el).forEach(function(c){c.textContent=c.dataset.count+(c.dataset.suffix||'')})}})}
observe();
/* year, date min */
$$('.year').forEach(function(y){y.textContent=new Date().getFullYear()});
var dt=$('input[name=date]');if(dt){var n=new Date();dt.min=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')}
/* enquiry form -> WhatsApp or Email (no database; user sends from their own app) */
var form=$('#enquiry-form');
if(form){var st=$('.status',form);
 function body(){var f=new FormData(form),g=function(k,v){return(f.get(k)||'').toString().trim()||v};
  var date=g('date','');if(date){var p=date.split('-');date=p[2]+'-'+p[1]+'-'+p[0]}
  return['Hello SK Convention Center, I would like to enquire about a booking.','','Name: '+g('name',''),'Phone: '+g('phone',''),'Event type: '+g('occasion',''),'Preferred date: '+(date||'Not decided yet'),'Message: '+g('message','—')].join('\n')}
 $$('[data-send]',form).forEach(function(b){b.addEventListener('click',function(){
  if(!form.reportValidity())return;var msg=body();
  if(b.dataset.send==='whatsapp'){var u='https://wa.me/'+PHONE+'?text='+encodeURIComponent(msg);st.textContent='Opening WhatsApp — please press Send there to deliver your enquiry.';var w=window.open(u,'_blank','noopener');if(!w)location.href=u}
  else{st.textContent='Opening your email app — please press Send there to deliver your enquiry.';location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Booking enquiry – '+(new FormData(form).get('occasion')||'Event'))+'&body='+encodeURIComponent(msg)}})});
 form.addEventListener('submit',function(e){e.preventDefault()})}
/* lightbox */
var lb=$('.lb'),lbImg=lb&&$('img',lb),lbCap=lb&&$('.lb-cap',lb),items=[],idx=0,last=null,sx=0;
function gItems(){var p=$('.page:not([hidden])')||d;return $$('.g[data-full]',p)}
function show(i){if(!items.length)return;idx=(i+items.length)%items.length;var it=items[idx];lbImg.src=window.SKIMG?SKIMG[it.dataset.full]:it.dataset.full;lbImg.alt=$('img',it).alt;lbCap.textContent=(idx+1)+' / '+items.length+'  ·  '+($('span',it)?$('span',it).textContent:'')}
function openLb(i){items=gItems();last=d.activeElement;show(i);lb.classList.add('open');lb.setAttribute('aria-hidden','false');d.body.style.overflow='hidden';$('.lb-x',lb).focus()}
function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');d.body.style.overflow='';if(last&&last.focus)last.focus()}
if(lb){d.addEventListener('click',function(e){var g=e.target.closest&&e.target.closest('.g[data-full]');if(g){items=gItems();openLb(items.indexOf(g))}});
 $('.lb-x',lb).addEventListener('click',closeLb);$('.lb-p',lb).addEventListener('click',function(){show(idx-1)});$('.lb-n',lb).addEventListener('click',function(){show(idx+1)});
 lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
 d.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
 lb.addEventListener('touchstart',function(e){sx=e.changedTouches[0].clientX},{passive:true});
 lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(idx+(dx<0?1:-1))},{passive:true})}
/* standalone preview router: #page or #page/anchor */
var pages=$$('.page');
if(pages.length){
 function route(){var h=location.hash.replace('#','').split('/'),name=h[0]||'home',anchor=h[1];
  if(!pages.some(function(p){return p.dataset.page===name}))name='home';
  pages.forEach(function(p){p.hidden=p.dataset.page!==name});
  $$('.nav a,.menu nav a').forEach(function(a){var on=a.getAttribute('href')==='#'+name;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  d.title=({home:'Home',about:'About',auditorium:'Auditorium',gallery:'Gallery',weddings:'Weddings',location:'Location',contact:'Contact'}[name])+' | SK Convention Center, Mannarkkad';
  setMenu(false);observe();
  var el=anchor&&d.getElementById(anchor);if(el)setTimeout(function(){el.scrollIntoView({behavior:reduced?'auto':'smooth'})},60);else scrollTo(0,0)}
 addEventListener('hashchange',route);route()}
})();
