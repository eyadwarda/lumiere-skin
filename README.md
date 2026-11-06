# Lumière Skin — E-commerce Portfolio Demo

A responsive skincare storefront and admin dashboard built with vanilla HTML, CSS and JavaScript. The original visual direction (editorial typography, cool blue accents, clean clinical layout) is retained and extended into a working front-end demo.

## Features

- Responsive storefront with category filters, search and sorting
- Real product listings with product packshots, retailer links and reference prices from Egyptian retailers
- Shopping bag with quantity controls and removal
- Simulated checkout that creates an order in browser storage
- Admin overview with revenue, order and catalogue metrics
- Order status workflow: Pending → Processing → Shipped → Delivered
- Delivered orders are excluded from Active orders and available in Delivered archive
- Product create/edit/hide/show/delete controls
- Store announcement/settings editor and demo-data reset
- Newsletter demo subscription

## Run locally

Open `index.html` in a browser. No build step or package installation is required. For a local development server, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Demo admin

Open `admin.html` or click **Admin demo** in the footer. No login is implemented in this portfolio-only version. Do not use it to manage real customers or orders.

## Important limitations

- Data is stored in `localStorage` in the current browser only. It is not shared across devices and is not secure.
- Checkout is simulated. No payment, email, shipping label, or real order notification is created.
- EGP prices are snapshots from Egyptian retailer listings checked in November 2026; they can change and are not a live price feed or an offer to sell.
- Product packshots are loaded from brand/retailer image URLs. Confirm image-use permissions and keep attribution/retailer links before any commercial launch.
- Product details are short summaries; always check the manufacturer's current packaging and ingredients.

## Suggested backend integration

Replace the local `Lumiere` data adapter in `app.js` with API calls. Suggested resources: `GET/POST/PATCH/DELETE /api/products`, `GET/POST/PATCH /api/orders`, `GET/PATCH /api/settings`. Use a real database, server-side validation, authentication/authorization for admin routes, and a payment provider's hosted checkout if real payments are ever added. Do not trust browser storage for inventory, order totals, or admin permissions.

## Product references and price snapshots

- CeraVe Foaming Facial Cleanser 236ml — EGP 620 at Bloom Pharmacy: https://www.bloompharmacy.com/products/cerave-foaming-cleanser
- The Ordinary Niacinamide 10% + Zinc 1% 30ml — EGP 950 at Bloom Pharmacy: https://www.bloompharmacy.com/products/the-ordinary-niacinamide-10-zinc-1-solution-egcg-30ml
- La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+ 50ml — EGP 1,070 at Bloom Pharmacy: https://www.bloompharmacy.com/products/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf-50-50ml
- Bioderma Sensibio H2O 250ml — EGP 619 at Abdin Pharmacies: https://abdinpharmacies.com/shop/51881-bioderma-sensibio-h2o-250ml-32575
- La Roche-Posay Cicaplast Baume B5+ 40ml — EGP 900 at Bloom Pharmacy: https://www.bloompharmacy.com/products/la-roche-posay-cicaplast-baume-b5-soothing-repairing-balm

Product names and brand information are used for a demonstration catalogue. Lumière Skin is not represented as an authorised retailer or affiliated with these brands.
