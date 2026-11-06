(() => {
  const client = window.supabaseClient;
  const L = window.Lumiere;
  if (!client || !L) return;

  async function loadCatalogue() {
    const [productsResult, settingsResult] = await Promise.all([
      client.from('products').select('id,brand,name,category,price,stock,description,image,source,active').eq('active', true).order('created_at', {ascending:true}),
      client.from('store_settings').select('store_name,announcement,support_email').eq('id', true).maybeSingle()
    ]);
    if (productsResult.error) {
      console.error('Supabase products error:', productsResult.error);
      L.toast('Could not load products. Please refresh.');
      return;
    }
    L.db.products = productsResult.data || [];
    if (settingsResult.data) {
      L.db.settings = {
        storeName: settingsResult.data.store_name,
        announcement: settingsResult.data.announcement,
        supportEmail: settingsResult.data.support_email
      };
      const announcement = document.querySelector('.announcement span');
      if (announcement && settingsResult.data.announcement) announcement.textContent = settingsResult.data.announcement;
    }
    const search = document.getElementById('productSearch');
    if (search) search.dispatchEvent(new Event('input', {bubbles:true}));
    refreshCartDisplay();
  }

  function refreshCartDisplay() {
    const cart = L.db.cart || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const countNode = document.getElementById('cartCount');
    if (countNode) countNode.textContent = count;
    const itemsNode = document.getElementById('cartItems');
    const subtotalNode = document.getElementById('cartSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    let total = 0;
    if (itemsNode) {
      itemsNode.innerHTML = cart.map(item => {
        const product = L.db.products.find(p => p.id === item.id);
        if (!product) return '';
        total += product.price * item.qty;
        return '<div class="cart-row"><div class="cart-thumb">✦</div><div><b>' +
          L.escapeHTML(product.name) + '</b><small>' + L.money(product.price) + ' · ' +
          L.escapeHTML(product.brand) + '</small><div class="qty-controls"><button data-qty="' +
          L.escapeHTML(product.id) + '" data-delta="-1">−</button><span>' + item.qty +
          '</span><button data-qty="' + L.escapeHTML(product.id) +
          '" data-delta="1">＋</button></div></div><button class="remove-item" data-remove="' +
          L.escapeHTML(product.id) + '">Remove</button></div>';
      }).join('') || '<div class="empty-state">Your bag is waiting for something good.</div>';
    }
    if (subtotalNode) subtotalNode.textContent = L.money(total);
    if (checkoutTotal) checkoutTotal.textContent = L.money(total);
    const checkoutButton = document.getElementById('checkoutBtn');
    if (checkoutButton) checkoutButton.disabled = !cart.length;
  }

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const cart = L.db.cart || [];
      if (!cart.length) return;
      const submit = checkoutForm.querySelector('button[type="submit"]');
      if (submit) { submit.disabled = true; submit.textContent = 'Placing order…'; }
      const form = new FormData(checkoutForm);
      const {data, error} = await client.rpc('place_order', {
        p_customer_name: String(form.get('name') || '').trim(),
        p_customer_phone: String(form.get('phone') || '').trim(),
        p_customer_email: String(form.get('email') || '').trim(),
        p_customer_address: String(form.get('address') || '').trim(),
        p_note: String(form.get('note') || '').trim(),
        p_items: cart.map(item => ({id:item.id, qty:item.qty}))
      });
      if (submit) { submit.disabled = false; submit.textContent = 'Place demo order ↗'; }
      if (error) {
        L.toast(error.message || 'Could not place order');
        return;
      }
      L.db.cart = [];
      L.save();
      checkoutForm.reset();
      document.getElementById('closeCheckout')?.click();
      document.getElementById('closeCart')?.click();
      refreshCartDisplay();
      L.toast('Order placed successfully · ' + (typeof data === 'string' ? data : 'Thank you'));
      await loadCatalogue();
    }, true);
  }

  loadCatalogue();
  window.LumiereSupabase = {loadCatalogue};
})();
