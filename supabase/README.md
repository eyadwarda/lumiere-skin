# Lumière Skin — Supabase backend setup

This folder contains the first backend migration. It does not change the storefront styling.

## 1. Create the Supabase project
1. Create a project at https://supabase.com/dashboard.
2. Choose a strong database password and save it somewhere private.
3. Wait for the database to finish provisioning.

## 2. Create the database schema
1. Open **SQL Editor** in the Supabase dashboard.
2. Open `schema.sql` from this folder, copy its full contents, and paste it into a new SQL query.
3. Run the query. It creates the catalogue, orders, order items, store settings, row-level security policies, and a secure checkout function.

## 3. Create the admin account
1. Open **Authentication → Users** and create the admin user with an email you control.
2. Do not expose a service-role key in the website.
3. Set the user's `app_metadata` role to `admin` from a trusted server-side/admin environment. Never set an admin role from browser JavaScript or user-editable metadata.
4. Keep email confirmation enabled for the admin account.

The SQL policies only grant admin access when the signed-in user's trusted `app_metadata.role` is exactly `admin`.

## 4. Frontend connection values
From **Project Settings → API**, copy:
- Project URL
- Publishable key (or legacy anon key)

These two values are intended for browser use with Row Level Security enabled. Never use or paste the **service_role / secret key** into frontend files, GitHub, or this chat.

## Database notes
- Public visitors can read active products and public store settings.
- Customers submit checkout through `place_order`; the database recalculates prices, validates stock, and creates the order atomically.
- Customer order records and order items are not publicly readable.
- Only authenticated admins can read/update orders or manage products/settings.
- This is still a portfolio/demo foundation. Before real commerce, add abuse protection (e.g. CAPTCHA/rate limiting), privacy notice/retention rules, email notifications, and a payment provider if needed.
