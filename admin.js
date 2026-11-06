(() => {
  const client=window.supabaseClient, L=window.Lumiere;
  if(!client||!L)return;
  const $=id=>document.getElementById(id), esc=L.escapeHTML, money=L.money;
  let view='overview', orderFilter='active', adminOrders=[], adminProducts=[];
  const toast=message=>L.toast(message,true);
  const date=value=>new Date(value).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const status=value=>'<span class="status '+String(value).toLowerCase()+'">'+esc(value)+'</span>';

  function showLogin(message=''){$('adminShell').hidden=true;$('adminLogin').hidden=false;$('adminLoginError').textContent=message;}
  function showDashboard(){$('adminLogin').hidden=true;$('adminShell').hidden=false;}
  function mapOrder(row){return {id:row.id,customer:{name:row.customer_name,phone:row.customer_phone,email:row.customer_email||'',address:row.customer_address},items:(row.order_items||[]).map(item=>({id:item.product_id,name:item.product_name,brand:item.brand,price:item.unit_price,qty:item.quantity})),total:row.total,status:row.status,createdAt:new Date(row.created_at).getTime(),note:row.note||''};}

  async function loadData(){
    const results=await Promise.all([
      client.from('products').select('*').order('created_at',{ascending:false}),
      client.from('orders').select('*, order_items(*)').order('created_at',{ascending:false}),
      client.from('store_settings').select('*').eq('id',true).single()
    ]);
    const failure=results.find(result=>result.error);if(failure)throw failure.error;
    adminProducts=results[0].data||[];
    adminOrders=(results[1].data||[]).map(mapOrder);
    L.db.products=adminProducts;L.db.orders=adminOrders;
    const s=results[2].data;if(s)L.db.settings={storeName:s.store_name,announcement:s.announcement,supportEmail:s.support_email};
  }
  const orders=()=>adminOrders.slice().sort((a,b)=>b.createdAt-a.createdAt);
  function setView(next){
    view=next;
    document.querySelectorAll('.side-link').forEach(b=>b.classList.toggle('active',b.dataset.view===next));
    document.querySelectorAll('.admin-view').forEach(x=>x.hidden=x.id!=='view-'+next);
    $('viewTitle').textContent=({overview:'Overview',orders:'Orders',products:'Products',settings:'Store settings'})[next];
    if(next==='overview')renderOverview();if(next==='orders')renderOrders();if(next==='products')renderProducts();
  }
  function renderOverview(){
    const all=orders(),pending=all.filter(o=>o.status==='Pending');
    $('statRevenue').textContent=money(all.filter(o=>o.status!=='Cancelled').reduce((n,o)=>n+o.total,0));
    $('statOrders').textContent=all.length;$('statPending').textContent=pending.length;
    $('statProducts').textContent=adminProducts.filter(p=>p.active!==false).length;$('pendingBadge').textContent=pending.length;
    $('recentOrders').innerHTML=all.slice(0,5).map(o=>'<tr><td><b>'+esc(o.id)+'</b></td><td>'+esc(o.customer.name)+'</td><td>'+date(o.createdAt)+'</td><td>'+money(o.total)+'</td><td>'+status(o.status)+'</td></tr>').join('')||'<tr><td colspan="5">No orders yet.</td></tr>';
    const counts=['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=>[s,all.filter(o=>o.status===s).length]),max=Math.max(1,...counts.map(x=>x[1]));
    $('statusBreakdown').innerHTML=counts.map(([s,n])=>'<div class="status-line"><span>'+s+'</span><div class="status-track"><i style="width:'+(n/max*100)+'%"></i></div><b>'+n+'</b></div>').join('');
  }
  function renderOrders(){
    const q=($('orderSearch').value||'').toLowerCase();
    const list=orders().filter(o=>orderFilter==='active'?!['Delivered','Cancelled'].includes(o.status):orderFilter==='delivered'?o.status==='Delivered':true).filter(o=>(o.id+' '+o.customer.name+' '+o.customer.phone).toLowerCase().includes(q));
    $('ordersTable').innerHTML=list.map(o=>'<tr><td><b>'+esc(o.id)+'</b></td><td>'+esc(o.customer.name)+'<br><small>'+esc(o.customer.address)+'</small></td><td>'+esc(o.customer.phone)+'</td><td>'+date(o.createdAt)+'</td><td>'+o.items.reduce((n,x)=>n+x.qty,0)+' item(s)</td><td><b>'+money(o.total)+'</b></td><td>'+status(o.status)+'<br><select class="order-status" data-order="'+esc(o.id)+'" aria-label="Update status for '+esc(o.id)+'"><option '+(o.status==='Pending'?'selected':'')+'>Pending</option><option '+(o.status==='Processing'?'selected':'')+'>Processing</option><option '+(o.status==='Shipped'?'selected':'')+'>Shipped</option><option '+(o.status==='Delivered'?'selected':'')+'>Delivered</option><option '+(o.status==='Cancelled'?'selected':'')+'>Cancelled</option></select></td></tr>').join('');
    $('emptyOrders').hidden=!!list.length;$('pendingBadge').textContent=adminOrders.filter(o=>o.status==='Pending').length;
  }
  function renderProducts(){
    $('productsTable').innerHTML=adminProducts.map(p=>'<tr><td><div class="product-cell"><div class="mini-thumb">✦</div><div><b>'+esc(p.name)+'</b><small>'+esc(p.brand)+'</small></div></div></td><td>'+esc(p.category)+'</td><td>'+money(p.price)+'</td><td>'+p.stock+'</td><td>'+(p.active===false?'Hidden':'Visible')+'</td><td><button class="table-action" data-edit="'+esc(p.id)+'">Edit</button><button class="table-action" data-toggle="'+esc(p.id)+'">'+(p.active===false?'Show':'Hide')+'</button><button class="table-action danger" data-delete="'+esc(p.id)+'">Delete</button></td></tr>').join('');
  }
  function renderSettings(){const form=$('settingsForm'),s=L.db.settings||{};form.elements.storeName.value=s.storeName||'Lumière Skin';form.elements.announcement.value=s.announcement||'';form.elements.supportEmail.value=s.supportEmail||'';}
  async function refreshAll(){await loadData();if(view==='overview')renderOverview();if(view==='orders')renderOrders();if(view==='products')renderProducts();renderSettings();}
  function openProduct(p){
    const form=$('productForm');form.reset();form.elements.id.value=p?.id||'';form.elements.name.value=p?.name||'';
    form.elements.brand.value=p?.brand||'';form.elements.category.value=p?.category||'Cleanser';
    form.elements.price.value=p?.price||'';form.elements.stock.value=p?.stock??'';
    form.elements.image.value=p?.image||'';form.elements.description.value=p?.description||'';
    $('productModalTitle').textContent=p?'Edit product':'Add product';$('productModal').classList.add('show');
  }
  async function initialize(session){
    if(!session?.user||session.user.app_metadata?.role!=='admin'){showLogin('Administrator access is required.');return;}
    try{
      showDashboard();await loadData();
      $('todayLabel').textContent=new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
      renderSettings();setView('overview');
    }catch(error){console.error(error);await client.auth.signOut();showLogin('Could not load admin data. Check the admin role and database policies.');}
  }
  $('adminLoginForm').addEventListener('submit',async event=>{
    event.preventDefault();const form=new FormData(event.currentTarget),button=$('adminLoginButton');
    button.disabled=true;button.textContent='Signing in…';$('adminLoginError').textContent='';
    const {data,error}=await client.auth.signInWithPassword({email:String(form.get('email')).trim(),password:String(form.get('password'))});
    button.disabled=false;button.textContent='Sign in';
    if(error){$('adminLoginError').textContent=error.message;return;}
    if(data.user?.app_metadata?.role!=='admin'){await client.auth.signOut();showLogin('This account does not have administrator access.');return;}
    await initialize(data.session);
  });
  async function signOut(){await client.auth.signOut();showLogin('You have signed out.');}
  $('adminSignOut').addEventListener('click',signOut);$('settingsSignOut').addEventListener('click',signOut);
  document.querySelectorAll('.side-link').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.goto)));
  $('orderFilters').addEventListener('click',event=>{const b=event.target.closest('[data-filter]');if(!b)return;orderFilter=b.dataset.filter;document.querySelectorAll('#orderFilters button').forEach(x=>x.classList.toggle('selected',x===b));renderOrders();});
  $('orderSearch').addEventListener('input',renderOrders);
  $('ordersTable').addEventListener('change',async event=>{
    const select=event.target.closest('[data-order]');if(!select)return;
    const {error}=await client.from('orders').update({status:select.value}).eq('id',select.dataset.order);
    if(error){toast(error.message);await refreshAll();return;}
    const order=adminOrders.find(o=>o.id===select.dataset.order);if(order)order.status=select.value;
    renderOrders();renderOverview();toast('Order status updated');
  });
  $('addProductBtn').addEventListener('click',()=>openProduct());
  $('closeProductModal').addEventListener('click',()=>$('productModal').classList.remove('show'));
  $('productModal').addEventListener('click',event=>{if(event.target===$('productModal'))$('productModal').classList.remove('show');});
  $('productForm').addEventListener('submit',async event=>{
    event.preventDefault();const form=new FormData(event.currentTarget),id=String(form.get('id')||''),old=adminProducts.find(p=>p.id===id);
    const payload={brand:String(form.get('brand')).trim(),name:String(form.get('name')).trim(),category:String(form.get('category')),price:Number(form.get('price')),stock:Number(form.get('stock')),image:String(form.get('image')).trim(),description:String(form.get('description')).trim(),active:old?.active!==false,source:old?.source||''};
    const result=id?await client.from('products').update(payload).eq('id',id):await client.from('products').insert({id:'p'+Date.now(),...payload});
    if(result.error){toast(result.error.message);return;}
    $('productModal').classList.remove('show');await refreshAll();toast('Product saved');
  });
  $('productsTable').addEventListener('click',async event=>{
    const edit=event.target.closest('[data-edit]'),toggle=event.target.closest('[data-toggle]'),remove=event.target.closest('[data-delete]');
    if(edit){const p=adminProducts.find(x=>x.id===edit.dataset.edit);if(p)openProduct(p);}
    if(toggle){const p=adminProducts.find(x=>x.id===toggle.dataset.toggle);if(!p)return;const {error}=await client.from('products').update({active:p.active===false}).eq('id',p.id);if(error){toast(error.message);return;}await refreshAll();toast('Product visibility updated');}
    if(remove){const p=adminProducts.find(x=>x.id===remove.dataset.delete);if(!p)return;if(confirm('Delete '+p.name+'?')){const {error}=await client.from('products').delete().eq('id',p.id);if(error){toast(error.message);return;}await refreshAll();toast('Product deleted');}}
  });
  $('settingsForm').addEventListener('submit',async event=>{
    event.preventDefault();const form=new FormData(event.currentTarget),payload={id:true,store_name:String(form.get('storeName')).trim(),announcement:String(form.get('announcement')).trim(),support_email:String(form.get('supportEmail')).trim()};
    const {error}=await client.from('store_settings').upsert(payload,{onConflict:'id'});
    if(error){toast(error.message);return;}
    L.db.settings={storeName:payload.store_name,announcement:payload.announcement,supportEmail:payload.support_email};toast('Store settings saved');
  });
  client.auth.getSession().then(({data,error})=>{
    if(error){showLogin('Could not verify your session. Please sign in again.');return;}
    if(!data.session){showLogin();return;}
    if(data.session.user.app_metadata?.role!=='admin'){client.auth.signOut();showLogin('This account does not have administrator access.');return;}
    initialize(data.session);
  });
  client.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT')showLogin('You have signed out.');});
})();