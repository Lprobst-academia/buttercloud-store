const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const money=n=>'CHF '+n.toFixed(2),stars=r=>'★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));
const P={
big:{id:'big',name:'Buttercloud Squishy 400 g',size:'Large · 400 g',price:24.9,rating:4.8,reviews:126,badge:'Bestseller',bg:'bg1',short:'The original salted butter squishy: chunky, soft and slow to bounce back.'},
mini:{id:'mini',name:'Buttercloud Squishy Small',size:'Small · approx. 150 g',price:9.9,rating:4.7,reviews:58,badge:'Pocket-sized',bg:'bg2',short:'The same butter look in a smaller, cheaper size for bags and pockets.'},
duo:{id:'duo',name:'Small Duo Bundle',size:'2 × small',price:17.9,rating:4.7,reviews:31,badge:'Bundle',bg:'bg3',short:'Two small squishies: one for you, one to share or swap.'}};
const LB={big:['Salted','BUTTERCLOUD','400 g'],mini:['Salted','BUTTERCLOUD','150 g']};
const stk=(k,w,btn)=>{const l=LB[k],i=`<span class="lb"><i>${l[0]}</i><b>${l[1]}</b><u>${l[2]}</u></span>`;return btn?`<button class="stick" id="stk" data-a="crack" data-n="0" style="--w:${w}" aria-label="Squeeze the squishy to crack it">${i}<svg class="cr" id="cr" viewBox="0 0 230 100" aria-hidden="true"></svg></button>`:`<div class="stick" style="--w:${w}">${i}</div>`};
const art=(id,big)=>{const k=id==='duo'?'mini':id,w=id==='big'?(big?'84%':'74%'):(big?'72%':'62%');const body=id==='duo'?`<div class="duo">${stk(k,w,big)}${stk(k,w)}</div>`:stk(k,w,big);
return big?body:`<span class="art">${body}<img class="ph" src="images/${id}.jpg" alt="${P[id].name}" loading="lazy" onload="this.parentNode.classList.add('has')" onerror="this.remove()"></span>`};
let cart=store.get('bc-cart',{}),last;
Object.keys(cart).forEach(k=>{if(!P[k]||!(cart[k]>0))delete cart[k]});
const dom=c=>c==='CH'||c==='LI';
function tot(c){const sub=Object.keys(cart).reduce((s,k)=>s+P[k].price*cart[k],0);const sh=!sub?0:dom(c||'CH')?(sub>=60?0:6.9):(sub>=120?0:14.9);return{sub,sh,total:sub+sh}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2800)}
/* ---- Layers ---- */
function open(id){const l=$('#'+id);last=document.activeElement;l.classList.add('show');document.body.style.overflow='hidden';setTimeout(()=>{const f=l.querySelector('.card button,.card input,.card select');f&&f.focus()},60)}
function shut(id){$('#'+id).classList.remove('show');if(!$('.layer.show'))document.body.style.overflow='';if(last&&last.isConnected)last.focus()}
/* ---- Sound ---- */
let mute=store.get('bc-mute',false);const A={};
function play(n,v){if(mute)return;try{A[n]=A[n]||new Audio('sounds/'+n+'.wav');const a=A[n].cloneNode();a.volume=v||.6;a.play().catch(()=>{})}catch(e){}}
function syncSnd(){const b=$('#snd');b.setAttribute('aria-pressed',!mute);b.setAttribute('aria-label',mute?'Turn sound on':'Turn sound off')}
function toggleSnd(){mute=!mute;store.set('bc-mute',mute);syncSnd();play('pop')}
/* ---- Crack ---- */
const CR=['M118 6 L112 30 L122 46 L114 66','M122 46 L146 56 L152 78 L168 94','M112 30 L88 38 L80 58 L60 66 M114 66 L100 86','M146 56 L176 46 L198 54 M88 38 L70 20 M168 94 L190 84'];
const CM=['Tap the butter. Squeeze until it cracks.','A thin crack appears.','It spreads.','Almost there.','Cracked! Tap once more to start again.'];
function crack(){const s=$('#stk');if(!s)return;let n=+s.dataset.n;n=n>=4?0:n+1;s.dataset.n=n;s.classList.remove('sq');void s.offsetWidth;s.classList.add('sq');
$('#cr').innerHTML=CR.slice(0,n).map(d=>`<path d="${d}" class="c1"/><path d="${d}" class="c2"/>`).join('');$('#cm').textContent=CM[n];
play('squish',.5);if(n)setTimeout(()=>play('crack',n===4?1:.6),70)}
/* ---- Shop ---- */
$('#products').innerHTML=Object.values(P).map(p=>`<article class="product-card"><button class="product-image ${p.bg}" data-a="view" data-id="${p.id}" aria-label="View details for ${p.name}"><span class="product-tag">${p.badge}</span>${art(p.id)}</button><div class="product-info"><div><h3>${p.name}</h3><p>${p.size}</p><p class="rate"><span aria-hidden="true">${stars(p.rating)}</span> ${p.rating} (${p.reviews} reviews)</p></div><div class="price">${money(p.price)}</div></div><p class="desc">${p.short}</p><button class="quick-add" data-a="add" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add to cart</button></article>`).join('');
function view(id){play('squish');const p=P[id];$('#pm').setAttribute('aria-labelledby','pm-t');$('#pm-card').innerHTML=`<button class="close" data-a="close" aria-label="Close product details">×</button><div class="pm-grid"><div class="pm-img ${p.bg}"><span class="product-tag">${p.badge}</span>${art(id,1)}<p class="hint" id="cm" role="status">Tap the butter. Squeeze until it cracks.</p></div><div class="pm-info"><h2 id="pm-t">${p.name}</h2><p class="rate" style="margin-bottom:4px"><span aria-hidden="true">${stars(p.rating)}</span> ${p.rating} · ${p.reviews} reviews</p><div class="price" style="font-size:22px">${money(p.price)}</div><p style="margin-top:10px"><strong>Size:</strong> ${p.size}<br>${p.short} Squeeze it, press it, watch it rise again. It is a squishy toy and not edible.</p><div class="pm-row"><div class="qty" style="margin:0"><button data-a="q" data-d="-1" aria-label="Decrease quantity">−</button><span id="pq" aria-live="polite">1</span><button data-a="q" data-d="1" aria-label="Increase quantity">+</button></div><button class="btn btn-dark" data-a="addq" data-id="${id}">Add to cart</button></div><details open><summary>Product details</summary><p>Butter-shaped squishy with a salted-butter look. Keep away from heat and direct sunlight and wipe clean with a dry cloth. Not a food item and not for eating. Check the product label for age guidance.</p></details><details><summary>Shipping</summary><p>Switzerland CHF 6.90 (free from CHF 60), Europe CHF 14.90 (free from CHF 120). Example rates for this demo.</p></details><details><summary>Returns</summary><p>Example policy: return unused items in their original packaging within 14 days of delivery.</p></details></div></div>`;open('pm')}
/* ---- Cart ---- */
function save(){store.set('bc-cart',cart)}
function add(id,n){play('pop');cart[id]=Math.min(20,(cart[id]||0)+n);save();renderCart();const b=$('#bag');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');toast(P[id].name+' added to your cart.')}
function chg(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];else cart[id]=Math.min(20,cart[id]);save();renderCart()}
function renderCart(){const ids=Object.keys(cart),n=ids.reduce((s,k)=>s+cart[k],0),t=tot();$('#cc').textContent=n;$('#cart-n').textContent='('+n+')';
$('#cart-items').innerHTML=ids.length?ids.map(k=>`<div class="cart-line"><div class="cart-thumb"><div class="stick" style="--w:80%"></div></div><div><strong>${P[k].name}</strong><small>${money(P[k].price)} · ${P[k].size}</small><div class="qty"><button data-a="dec" data-id="${k}" aria-label="Decrease quantity of ${P[k].name}">−</button><span>${cart[k]}</span><button data-a="inc" data-id="${k}" aria-label="Increase quantity of ${P[k].name}">+</button></div><button class="link" data-a="rm" data-id="${k}">Remove</button></div><strong>${money(P[k].price*cart[k])}</strong></div>`).join(''):'<div class="empty">Your cart is empty.<br>Find something squishy in the <a href="#shop" data-a="close" style="text-decoration:underline">shop</a>.</div>';
const hint=t.sub&&t.sub<60?`<p class="cart-note">Add ${money(60-t.sub)} more for free shipping in Switzerland.</p>`:'';
$('#cart-foot').innerHTML=`<div style="border-top:1px solid var(--line);padding-top:16px"><div class="tr"><span>Subtotal</span><span>${money(t.sub)}</span></div><div class="tr"><span>Shipping (Switzerland)</span><span>${t.sh?money(t.sh):(t.sub?'Free':'–')}</span></div><div class="tr big"><span>Total</span><span>${money(t.total)}</span></div>${hint}<button class="checkout" data-a="checkout" ${ids.length?'':'disabled'}>Go to checkout</button><p class="cart-note" style="margin:8px 0 0">Demo store: no real payment is taken.</p></div>`}
/* ---- Checkout ---- */
function upd(){const c=$('#country').value,t=tot(c);$('#co-t').innerHTML=`<div class="tr"><span>Subtotal</span><span>${money(t.sub)}</span></div><div class="tr"><span>Shipping</span><span>${t.sh?money(t.sh):'Free'}</span></div><div class="tr big"><span>Total</span><span>${money(t.total)}</span></div>`;const z=$('#zip');z.pattern=dom(c)?'\\d{4}':'[A-Za-z0-9 \\-]{3,10}';z.title=dom(c)?'Swiss and Liechtenstein postal codes have 4 digits':'Enter a valid postal code'}
function renderCo(){$('#co-main').hidden=false;$('#co-done').hidden=true;$('#co-sum').innerHTML=Object.keys(cart).map(k=>`<div class="cart-line"><div><strong>${P[k].name}</strong><small>Qty ${cart[k]}</small></div><strong>${money(P[k].price*cart[k])}</strong></div>`).join('')+'<div id="co-t" style="margin-top:12px"></div>';upd()}
$('#country').addEventListener('change',upd);
$('#co-f').addEventListener('submit',e=>{e.preventDefault();$('#ref').textContent='BC-DEMO-'+Math.floor(1000+Math.random()*9000);cart={};save();renderCart();$('#co-main').hidden=true;$('#co-done').hidden=false;e.target.reset()});
/* ---- FAQ ---- */
const FAQ=[['What is the Buttercloud Squishy?','A soft squishy toy shaped like a block of salted butter. You squeeze it, it slowly rises back.'],['Is it food?','No. It only looks like butter. It is a squishy toy and must not be eaten.'],['What sizes are available?','A large 400 g version, a small version of about 150 g and a bundle of two small ones. Sizes are example specifications in this demo.'],['How soft is it?','Soft and slow-rising. Softness can vary a little from piece to piece.'],['How should I store it?','Keep it at room temperature, away from heat and direct sunlight. Wipe with a dry cloth.'],['Is it safe for children?','Please read the label and age guidance on the final product, and supervise young children. It is not food.'],['Where do you ship and how long does it take?','Switzerland, Liechtenstein and selected European countries. The delivery times shown here are examples for this demo.'],['Can I return it?','In this demo policy, unused items in original packaging can be returned within 14 days of delivery.']];
$('#faq-list').innerHTML=FAQ.map((f,i)=>`<div class="faq-item"><button class="faq-q" data-a="faq" aria-expanded="false" aria-controls="fa${i}">${f[0]} <span class="plus" aria-hidden="true">＋</span></button><div class="faq-a" id="fa${i}">${f[1]}</div></div>`).join('');
/* ---- Legal ---- */
const L={returns:['Shipping & Returns',['Example shipping: Switzerland and Liechtenstein CHF 6.90 (free from CHF 60), Europe CHF 14.90 (free from CHF 120).','Example returns: unused items in original packaging may be returned within 14 days of delivery. Return shipping costs and the refund process must be defined before launch.']],privacy:['Privacy Policy',['Demo text. This storefront stores your cart and cookie choice in your browser only. It sends no data to a server.','Before launch, a privacy policy that matches the real data processing (orders, payments, email, analytics) must be written and reviewed.']],terms:['Terms & Conditions',['Demo text. This storefront does not accept real orders.','Before launch, add terms covering prices, orders, delivery, withdrawal rights, warranty and liability, reviewed for Swiss law.']],imprint:['Imprint',['Company name: [to be added]','Address: [to be added]','Contact email: [to be added]','Commercial register / UID / VAT number: [to be added]','Represented by: [to be added]']]};
function showLegal(k){$('#lg-b').innerHTML=`<div class="tabs" role="group" aria-label="Legal pages">${Object.keys(L).map(x=>`<button data-a="tab" data-k="${x}" aria-current="${x===k}">${L[x][0]}</button>`).join('')}</div><h2>${L[k][0]}</h2>${L[k][1].map(t=>`<p>${t}</p>`).join('')}`}
/* ---- Cookies ---- */
function saveCk(o){store.set('bc-cookies',{necessary:true,pref:!!o.pref,ana:!!o.ana,mkt:!!o.mkt});$('#cookie-banner').classList.remove('show');if($('#ck').classList.contains('show'))shut('ck')}
function openCk(){const c=store.get('bc-cookies',{});$('#c-pref').checked=!!c.pref;$('#c-ana').checked=!!c.ana;$('#c-mkt').checked=!!c.mkt;open('ck')}
if(!store.get('bc-cookies',null))setTimeout(()=>$('#cookie-banner').classList.add('show'),600);
/* ---- Events ---- */
document.addEventListener('click',e=>{
const l=e.target.closest('.layer');if(l&&e.target===l){shut(l.id);return}
if(e.target.closest('.mmenu a'))$('#mmenu').classList.remove('open'),$('#menu-btn').setAttribute('aria-expanded','false');
const t=e.target.closest('[data-a]');if(!t)return;const id=t.dataset.id,a=t.dataset.a;if(a==='legal'||a==='toast')e.preventDefault();
const acts={view:()=>view(id),add:()=>add(id,1),addq:()=>{add(id,+$('#pq').textContent);shut('pm');open('cart')},
q:()=>{const n=$('#pq');n.textContent=Math.min(10,Math.max(1,+n.textContent+ +t.dataset.d))},
cart:()=>open('cart'),crack,snd:toggleSnd,close:()=>shut(t.closest('.layer').id),inc:()=>chg(id,1),dec:()=>chg(id,-1),rm:()=>chg(id,-99),
checkout:()=>{shut('cart');renderCo();open('co')},
menu:()=>{const o=$('#mmenu').classList.toggle('open');t.setAttribute('aria-expanded',o)},
faq:()=>{const o=t.parentElement.classList.toggle('open');t.setAttribute('aria-expanded',o)},
cookies:()=>openCk(),ckall:()=>saveCk({pref:1,ana:1,mkt:1}),ckno:()=>saveCk({}),cksave:()=>saveCk({pref:$('#c-pref').checked,ana:$('#c-ana').checked,mkt:$('#c-mkt').checked}),
legal:()=>{showLegal(t.dataset.k);open('lg')},tab:()=>showLegal(t.dataset.k),toast:()=>toast(t.dataset.m)};
acts[a]&&acts[a]()});
document.addEventListener('keydown',e=>{
if(e.key==='Escape'){$$('.layer.show').forEach(l=>shut(l.id));$('#mmenu').classList.remove('open')}
if(e.key==='Tab'){const l=$$('.layer.show').pop();if(!l)return;const f=[...l.querySelectorAll('button,input,select,textarea,a[href]')].filter(x=>!x.disabled&&x.offsetParent);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault()}}});
$('#cf').addEventListener('submit',e=>{e.preventDefault();$('#cf-msg').textContent='Thanks, '+e.target.name.value+'. This is a demo form, so your message was not sent.';e.target.reset()});
$('#nl').addEventListener('submit',e=>{e.preventDefault();toast('Demo only: newsletter sign-up is not connected.');e.target.reset()});
renderCart();
syncSnd();
