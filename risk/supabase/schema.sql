create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  category text not null default 'Clothing',
  sizes text[] not null default array['S', 'M', 'L', 'XL'],
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create sequence if not exists public.order_number_seq;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint not null default nextval('public.order_number_seq'),
  user_id uuid not null references auth.users (id) on delete restrict,
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment', 'paid', 'cancelled', 'fulfilled')),
  total numeric(10, 2) not null default 0 check (total >= 0),
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);

update public.orders
set order_number = nextval('public.order_number_seq')
where order_number is null;

alter table public.orders
  alter column order_number set default nextval('public.order_number_seq'),
  alter column order_number set not null;

create unique index if not exists orders_order_number_key
  on public.orders (order_number);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0)
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Anyone can view active products" on public.products;
create policy "Anyone can view active products"
  on public.products for select to anon, authenticated
  using (active);

drop policy if exists "Users can read their own orders" on public.orders;
create policy "Users can read their own orders"
  on public.orders for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can read items in their own orders" on public.order_items;
create policy "Users can read items in their own orders"
  on public.order_items for select to authenticated
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = (select auth.uid())
    )
  );

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create or replace function public.place_order(
  p_items jsonb,
  p_shipping_address jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_item jsonb;
  v_product public.products%rowtype;
  v_product_id uuid;
  v_size text;
  v_quantity integer;
  v_total numeric(10, 2) := 0;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to place an order.';
  end if;

  if p_items is null or jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Order items must be provided.';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Your bag is empty.';
  end if;
  if p_shipping_address is null or jsonb_typeof(p_shipping_address) is distinct from 'object' then
    raise exception 'A delivery address is required.';
  end if;
  if nullif(trim(p_shipping_address ->> 'full_name'), '') is null
    or nullif(trim(p_shipping_address ->> 'email'), '') is null
    or nullif(trim(p_shipping_address ->> 'address'), '') is null
    or nullif(trim(p_shipping_address ->> 'city'), '') is null
    or nullif(trim(p_shipping_address ->> 'region'), '') is null
    or nullif(trim(p_shipping_address ->> 'postal_code'), '') is null
    or nullif(trim(p_shipping_address ->> 'country'), '') is null then
    raise exception 'Complete all delivery details before placing your order.';
  end if;

  insert into public.orders (user_id, shipping_address)
  values (v_user_id, p_shipping_address)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item) is distinct from 'object' then
      raise exception 'An order item is invalid.';
    end if;

    v_product_id := (v_item ->> 'product_id')::uuid;
    v_size := nullif(trim(v_item ->> 'size'), '');
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_size is null or v_quantity is null or v_quantity < 1 or v_quantity > 20 then
      raise exception 'Each item must have a valid size and quantity between 1 and 20.';
    end if;

    select * into v_product
    from public.products
    where id = v_product_id and active
    for update;

    if not found then
      raise exception 'A product in your bag is no longer available.';
    end if;
    if not (v_size = any(v_product.sizes)) then
      raise exception 'The selected size is no longer available for %.', v_product.name;
    end if;
    if v_product.stock < v_quantity then
      raise exception 'Not enough stock remains for %.', v_product.name;
    end if;

    update public.products
    set stock = stock - v_quantity
    where id = v_product_id;

    insert into public.order_items (order_id, product_id, size, quantity, unit_price)
    values (v_order_id, v_product_id, v_size, v_quantity, v_product.price);
    v_total := v_total + (v_product.price * v_quantity);
  end loop;

  update public.orders
  set total = v_total
  where id = v_order_id;

  return v_order_id;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public;
grant execute on function public.place_order(jsonb, jsonb) to authenticated;

insert into public.products (name, slug, description, price, category, sizes, stock)
values
  ('Everyday Heavy Tee', 'everyday-heavy-tee', 'A heavyweight cotton staple with a relaxed fit.', 38.00, 'T-Shirts', array['S', 'M', 'L', 'XL'], 30),
  ('No Risk No Story Hoodie', 'no-risk-no-story-hoodie', 'A midweight fleece hoodie made for the everyday.', 76.00, 'Hoodies', array['S', 'M', 'L', 'XL', 'XXL'], 20),
  ('Risk It Core Cap', 'risk-it-core-cap', 'An adjustable cotton twill cap with an embroidered mark.', 32.00, 'Accessories', array['ONE SIZE'], 25)
on conflict (slug) do nothing;
