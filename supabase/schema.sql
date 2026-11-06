-- Lumiere Skin backend schema for Supabase
-- Run this file once in Supabase Dashboard > SQL Editor.
-- Admin access is controlled by app_metadata.role = 'admin' (set server-side only).

create table if not exists public.products (
  id text primary key,
  brand text not null,
  name text not null,
  category text not null check (category in ('Cleanser','Serum','Moisturizer','Sunscreen')),
  price integer not null check (price > 0),
  stock integer not null default 0 check (stock >= 0),
  description text not null default '',
  image text not null default '',
  source text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists public.order_number_seq start 1049;

create table if not exists public.orders (
  id text primary key default ('LS-' || lpad(nextval('public.order_number_seq')::text, 6, '0')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  note text not null default '',
  total integer not null check (total >= 0),
  status text not null default 'Pending' check (status in ('Pending','Processing','Shipped','Delivered','Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  brand text not null,
  unit_price integer not null check (unit_price > 0),
  quantity integer not null check (quantity > 0)
);

create table if not exists public.store_settings (
  id boolean primary key default true check (id),
  store_name text not null default 'Lumière Skin',
  announcement text not null default 'Thoughtful formulas. Straightforward routines.',
  support_email text not null default ''
);

insert into public.store_settings (id) values (true) on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

-- Public visitors can only read visible products.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products
for select to anon, authenticated using (active = true);

-- Only authenticated users whose app_metadata role is admin can manage catalogue data.
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Orders and order items are private; customers cannot query them from the browser.
drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders" on public.orders
for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders" on public.orders
for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins read order items" on public.order_items;
create policy "Admins read order items" on public.order_items
for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins manage store settings" on public.store_settings;
create policy "Admins manage store settings" on public.store_settings
for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings" on public.store_settings
for select to anon, authenticated using (true);

-- Checkout runs on the database, not in browser code. Prices and totals are
-- recalculated from the catalogue and stock is locked/decremented atomically.
create or replace function public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_customer_address text,
  p_note text,
  p_items jsonb
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id text;
  v_total integer := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
begin
  if length(trim(coalesce(p_customer_name, ''))) < 2
     or length(trim(coalesce(p_customer_phone, ''))) < 8
     or length(trim(coalesce(p_customer_address, ''))) < 5 then
    raise exception 'Please provide valid delivery details.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your bag is empty.';
  end if;
  if (select count(*) from jsonb_array_elements(p_items)) <>
     (select count(distinct value ->> 'id') from jsonb_array_elements(p_items)) then
    raise exception 'Duplicate products are not allowed in checkout.';
  end if;

  -- Validate and lock products in a stable order before calculating the total.
  for v_item in select value from jsonb_array_elements(p_items) order by value ->> 'id'
  loop
    v_qty := (v_item ->> 'qty')::integer;
    if v_qty < 1 or v_qty > 20 then
      raise exception 'Invalid item quantity.';
    end if;

    select * into v_product
    from public.products
    where id = v_item ->> 'id' and active = true
    for update;

    if not found then
      raise exception 'A product in your bag is no longer available.';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Not enough stock for %.', v_product.name;
    end if;

    v_total := v_total + (v_product.price * v_qty);
  end loop;

  insert into public.orders (
    customer_name, customer_phone, customer_email,
    customer_address, note, total
  ) values (
    trim(p_customer_name), trim(p_customer_phone),
    nullif(trim(coalesce(p_customer_email, '')), ''),
    trim(p_customer_address), coalesce(p_note, ''), v_total
  ) returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items) order by value ->> 'id'
  loop
    v_qty := (v_item ->> 'qty')::integer;
    select * into v_product from public.products where id = v_item ->> 'id';

    insert into public.order_items (
      order_id, product_id, product_name, brand, unit_price, quantity
    ) values (
      v_order_id, v_product.id, v_product.name, v_product.brand,
      v_product.price, v_qty
    );

    update public.products
    set stock = stock - v_qty, updated_at = now()
    where id = v_product.id;
  end loop;

  return v_order_id;
end;
$$;

revoke all on function public.place_order(text,text,text,text,text,jsonb) from public;
grant execute on function public.place_order(text,text,text,text,text,jsonb) to anon, authenticated;

-- Keep sequence access internal; order IDs are generated by the table default.
revoke all on sequence public.order_number_seq from anon, authenticated;
