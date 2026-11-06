/* Lumière Skin catalogue upgrade: real product packshots + Egypt retailer price snapshots. */
(() => {
  const L = window.Lumiere;
  if (!L) return;
  const products = [
    {id:'p1',brand:'CeraVe',name:'Foaming Facial Cleanser · 236ml',category:'Cleanser',price:620,stock:24,description:'Foaming gel cleanser for normal-to-oily skin with three essential ceramides, hyaluronic acid and niacinamide.',image:'https://www.cerave.eg/-/media/project/loreal/brand-sites/cerave/americas/eg/latest_pdp_images/foaming-facial-cleanser/foaming-cleanser-236ml-lg.jpg?hash=4BB8C74F2D9C23459988C108F57860A5&rev=-1%3Fw%3D667',source:'https://www.bloompharmacy.com/products/cerave-foaming-cleanser',priceNote:'EGP 620 · Bloom Pharmacy · Nov 2026',active:true},
    {id:'p2',brand:'The Ordinary',name:'Niacinamide 10% + Zinc 1% · 30ml',category:'Serum',price:950,stock:18,description:'Water-based serum with 10% niacinamide and 1% zinc PCA, designed to target the look of blemishes and visible sebum.',image:'https://www.bloompharmacy.com/cdn/shop/products/the-ordinary-niacinamide-10-zinc-1-solution-egcg-30ml-296129_1024x.jpg?v=1687636396',source:'https://www.bloompharmacy.com/products/the-ordinary-niacinamide-10-zinc-1-solution-egcg-30ml',priceNote:'EGP 950 · Bloom Pharmacy · Nov 2026',active:true},
    {id:'p3',brand:'La Roche-Posay',name:'Anthelios UVMune 400 Invisible Fluid SPF50+ · 50ml',category:'Sunscreen',price:1070,stock:12,description:'Very high UVA/UVB protection in an invisible fluid. Follow the product label for application and reapplication.',image:'https://www.bloompharmacy.com/cdn/shop/products/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf-50-50ml-599143_1024x.jpg?v=1687732887',source:'https://www.bloompharmacy.com/products/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf-50-50ml',priceNote:'EGP 1,070 · Bloom Pharmacy · Nov 2026',active:true},
    {id:'p4',brand:'Bioderma',name:'Sensibio H2O Micellar Water · 250ml',category:'Cleanser',price:749,stock:30,description:'Micellar cleansing water for sensitive skin, suitable for removing everyday impurities and make-up.',image:'https://abdinpharmacies.com/web/image/product.template/32575/image_1920?unique=4f99e52',source:'https://abdinpharmacies.com/shop/51881-bioderma-sensibio-h2o-250ml-32575',priceNote:'EGP 749 · Abdin Pharmacies · Nov 2026',active:true},
    {id:'p5',brand:'La Roche-Posay',name:'Cicaplast Baume B5+ · 40ml',category:'Moisturizer',price:900,stock:11,description:'Multi-purpose soothing and repairing balm for sensitive or irritated skin. Check the pack for directions and suitability.',image:'https://cdn.salla.sa/RrKRy/8e821a13-de6d-46e8-ba2e-5ff6bb971dfc-1000x1000-3jSvriUyM04ax7bkcFSHvZ55sOujstGz6xGkPgnf.jpg',source:'https://www.bloompharmacy.com/products/la-roche-posay-cicaplast-baume-b5-soothing-repairing-balm',priceNote:'EGP 900 · Bloom Pharmacy · Nov 2026',active:true}
  ];
  const ids = new Set(products.map(p => p.id));
  L.db.products = [...products, ...L.db.products.filter(p => !ids.has(p.id))];
  L.db.catalogVersion = 3;
  L.save();
  const byId = new Map(products.map(p => [p.id,p]));
  function decorate() {
    document.querySelectorAll('#productGrid .product-card').forEach(card => {
      const id = card.querySelector('[data-add]')?.dataset.add, p = byId.get(id);
      if (!p) return;
      const desc = card.querySelector('.product-info p');
      if (desc && !card.querySelector('.retailer-link')) {
        const a = document.createElement('a'); a.className='retailer-link'; a.href=p.source;
        a.target='_blank'; a.rel='noopener noreferrer'; a.textContent='Check retailer listing ↗'; desc.after(a);
      }
      const price = card.querySelector('.price');
      if (price && !card.querySelector('.price-note')) {
        const n=document.createElement('small'); n.className='price-note'; n.textContent=p.priceNote; price.after(n);
      }
    });
  }
  decorate();
  const grid=document.getElementById('productGrid');
  if(grid) new MutationObserver(decorate).observe(grid,{childList:true,subtree:true});
  if(window.renderAdmin) window.renderAdmin();
})();