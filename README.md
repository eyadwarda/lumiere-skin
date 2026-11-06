# Lumière Skin — E-commerce Portfolio Demo

A responsive skincare storefront and admin dashboard built with vanilla HTML, CSS and JavaScript. The original visual direction (editorial typography, cool blue accents, clean clinical layout) is retained and extended into a working front-end demo.

## Features

- Responsive storefront with category filters, search and sorting
- Real product names from CeraVe, The Ordinary, La Roche-Posay and Bioderma
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
- EGP prices are illustrative portfolio-demo values, not verified live retail prices or an offer to sell. Replace them with supplier-confirmed prices before any commercial use.
- Product images are editorial skincare imagery and may not depict the exact package. Replace with licensed product packshots before launch.
- Product details are short summaries; always check the manufacturer's current packaging and official product page for full ingredients and directions.

## Suggested backend integration

Replace the local `Lumiere` data adapter in `app.js` with API calls. Suggested resources: `GET/POST/PATCH/DELETE /api/products`, `GET/POST/PATCH /api/orders`, `GET/PATCH /api/settings`. Use a real database, server-side validation, authentication/authorization for admin routes, and a payment provider's hosted checkout if real payments are ever added. Do not trust browser storage for inventory, order totals, or admin permissions.

## Product references

- CeraVe Foaming Facial Cleanser: https://www.cerave.eg/en/skincare/cleansers/foaming-facial-cleanser
- CeraVe Egypt product catalogue: https://www.cerave.eg/en/skincare
- The Ordinary Egypt: https://theordinary.com/en-eg
- La Roche-Posay: https://www.laroche-posay.com/
- Bioderma: https://www.bioderma.com/

Product names and brand information are used for a demonstration catalogue. Lumière Skin is not represented as an authorised retailer or affiliated with these brands.
