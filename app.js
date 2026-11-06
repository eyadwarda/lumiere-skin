(() => {
  const KEY = 'lumiere_store_cart_v2';
  const seedProducts = [
    {id:'p1',brand:'CeraVe',name:'Foaming Facial Cleanser',category:'Cleanser',price:620,stock:24,description:'Foaming gel cleanser for normal-to-oily skin, with ceramides, hyaluronic acid and niacinamide.',image:'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',active:true},
    {id:'p2',brand:'The Ordinary',name:'Niacinamide 10% + Zinc 1%',category:'Serum',price:780,stock:18,description:'Water-based serum formulated with niacinamide and zinc PCA for blemish-prone skin.',image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',active:true},
    {id:'p3',brand:'CeraVe',name:'Moisturising Cream',category:'Moisturizer',price:690,stock:15,description:'Rich moisturising cream with three essential ceramides to help support the skin barrier.',image:'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80',active:true},
    {id:'p4',brand:'La Roche-Posay',name:'Anthelios UVMune 400 SPF50+ Invisible Fluid',category:'Sunscreen',price:1150,stock:12,description:'Daily high-protection sunscreen from the Anthelios UVMune 400 range.',image:'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80',active:true},
    {id:'p5',brand:'The Ordinary',name:'Hyaluronic Acid 2% + B5',category:'Serum',price:820,stock:20,description:'Hydrating serum featuring hyaluronic acid and vitamin B5.',image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80',active:true},
    {id:'p6',brand:'Bioderma',name:'Sensibio H2O Micellar Water',category:'Cleanser',price:540,stock:30,description:'Micellar cleansing water from the Sensibio range, designed for sensitive skin.',image:'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80',active:true},
    {id:'p7',brand:'CeraVe',name:'Resurfacing Retinol Serum',category:'Serum',price:990,stock:9,description:'A retinol serum with ceramides and niacinamide.',image:'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80',active:true},
    {id:'p8',brand:'La Roche-Posay',name:'Cicaplast Baume B5+',category:'Moisturizer',price:890,stock:11,description:'Multi-purpose soothing balm from the Cicaplast range.',image:'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80',active:true}
  ];
  let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){}
  const db={products:seedProducts,cart:Array.isArray(saved.cart)?saved.cart:[],settings:{announcement:''}};
  const money=n=>'EGP '+Number(n||0).toLocaleString('en-US');
  const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast=msg=>{const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('show'),2200)};
  const save=()=>localStorage.setItem(KEY,JSON.stringify({cart:db.cart}));
  const L=window.Lumiere={db,save,money,escapeHTML,toast,addToCart(id){const p=db.products.find(x=>String(x.id)===String(id));if(!p||p.stock<=0)return toast('Out of stock');const row=db.cart.find(x=>String(x.id)===String(id));if(row)row.qty++;else db.cart.push({id:p.id,qty:1});save();renderCart();toast('✓ Added to cart');}};
  const grid=document.getElementById('productGrid');
  const search=document.getElementById('productSearch');
  const sort=document.getElementById('sortProducts');
  const filters=document.getElementById('categoryFilters');
  let category='All';
  function renderProducts(){
    if(!grid)return;
    let list=db.products.filter(p=>p.active!==false&&(category==='All'||p.category===category));
    const q=(search?.value||'').toLowerCase();
    list=list.filter(p=>(p.name+' '+p.brand+' '+p.description).toLowerCase().includes(q));
    if(sort?.value==='price-low')list.sort((a,b)=>a.price-b.price);
    if(sort?.value==='price-high')list.sort((a,b)=>b.price-a.price);
    if(sort?.value==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
    grid.innerHTML=list.map((p,i)=>`<article class="product-card">
      <div class="product-img">${p.image?'<img class="product-photo" src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.brand+' '+p.name)+'" loading="lazy">':'<span>✦</span>'}
      ${i===0?'<span class="product-badge badge-best">Bestseller</span>':''}</div>
      <div class="product-body"><div class="product-skin-type">${escapeHTML(p.brand)} · ${escapeHTML(p.category)}</div>
      <h3>${escapeHTML(p.name)}</h3><p class="product-desc">${escapeHTML(p.description||'')}</p>
      <div class="product-footer"><div><span class="product-price">${money(p.price)}</span><div><span class="stars">★★★★★</span></div></div>
      <button class="add-btn" data-add="${escapeHTML(p.id)}" ${p.stock<=0?'disabled':''}>Add</button></div></div></article>`).join('');
    const empty=document.getElementById('emptyProducts');if(empty)empty.hidden=!!list.length;
  }
  function renderCart(){
    const count=db.cart.reduce((n,x)=>n+x.qty,0),countEl=document.getElementById('cartCount');
    if(countEl)countEl.textContent=count;
    const items=document.getElementById('cartItems');let total=0;
    if(items)items.innerHTML=db.cart.map(row=>{const p=db.products.find(x=>String(x.id)===String(row.id));if(!p)return'';total+=Number(p.price)*row.qty;return `<div class="shop-cart-row"><div><b>${escapeHTML(p.name)}</b><small>${money(p.price)} · ${escapeHTML(p.brand)}</small><div class="shop-qty"><button data-qty="${escapeHTML(p.id)}" data-delta="-1">−</button><span>${row.qty}</span><button data-qty="${escapeHTML(p.id)}" data-delta="1">＋</button></div></div><button class="shop-remove" data-remove="${escapeHTML(p.id)}">Remove</button></div>`}).join('')||'<p class="empty-products">Your bag is empty.</p>';
    const sub=document.getElementById('cartSubtotal'),ct=document.getElementById('checkoutTotal');if(sub)sub.textContent=money(total);if(ct)ct.textContent=money(total);
    const checkout=document.getElementById('checkoutBtn');if(checkout)checkout.disabled=!db.cart.length;
  }
  function openCart(){document.getElementById('cartDrawer')?.classList.add('open');document.getElementById('overlay')?.classList.add('show');renderCart()}
  function closeCart(){document.getElementById('cartDrawer')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('show')}
  document.getElementById('openCart')?.addEventListener('click',openCart);
  document.getElementById('closeCart')?.addEventListener('click',closeCart);
  document.getElementById('overlay')?.addEventListener('click',closeCart);
  document.getElementById('cartItems')?.addEventListener('click',e=>{const q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');if(q){const row=db.cart.find(x=>String(x.id)===q.dataset.qty);if(row){row.qty+=Number(q.dataset.delta);if(row.qty<=0)db.cart=db.cart.filter(x=>String(x.id)!==q.dataset.qty)}}if(r)db.cart=db.cart.filter(x=>String(x.id)!==r.dataset.remove);save();renderCart()});
  document.getElementById('checkoutBtn')?.addEventListener('click',()=>{if(!db.cart.length)return;document.getElementById('checkoutModal')?.classList.add('show')});
  document.getElementById('closeCheckout')?.addEventListener('click',()=>document.getElementById('checkoutModal')?.classList.remove('show'));
  document.getElementById('checkoutModal')?.addEventListener('click',e=>{if(e.target.id==='checkoutModal')e.currentTarget.classList.remove('show')});
  document.getElementById('checkoutForm')?.addEventListener('submit',e=>{e.preventDefault();toast('Online order service is unavailable. Please try again.');});
  grid?.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)L.addToCart(b.dataset.add)});
  filters?.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;renderProducts()});
  search?.addEventListener('input',renderProducts);sort?.addEventListener('change',renderProducts);
  document.getElementById('menuToggle')?.addEventListener('click',()=>document.getElementById('mainNav')?.classList.toggle('open'));
  renderProducts();renderCart();
  window.LumiereSupabaseReady=()=>{renderProducts();renderCart()};
})();