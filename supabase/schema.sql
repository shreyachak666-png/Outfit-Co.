-- =============================================================================
-- Outfit&Co. — Supabase schema
--
-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL Editor
-- -> New query -> paste this whole file -> Run). It creates the two tables
-- that hold your content, locks them down with row-level security so only
-- YOU (an authenticated user) can write to them while the public can only
-- read published outfits, sets up the image storage bucket, and inserts one
-- demo outfit so you can see how everything works.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists public.outfits (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text,
  image_url    text,
  image_path   text,
  card_color   text not null default '#FBF7F0',
  published    boolean not null default true,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists outfits_published_position_idx
  on public.outfits (published, position);

create table if not exists public.products (
  id         uuid primary key default gen_random_uuid(),
  outfit_id  uuid not null references public.outfits (id) on delete cascade,
  name       text not null,
  url        text not null,
  position   integer not null default 0
);

create index if not exists products_outfit_id_idx on public.products (outfit_id);

-- Keep `updated_at` current automatically.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists outfits_set_updated_at on public.outfits;
create trigger outfits_set_updated_at
  before update on public.outfits
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. Row-level security
--
-- Anyone (anonymous visitors) can READ published outfits and their products.
-- Only a logged-in (authenticated) user — i.e. you — can create, edit,
-- delete, hide/show or reorder anything. Since this is a single-admin site,
-- "authenticated" is effectively "you".
-- ---------------------------------------------------------------------------

alter table public.outfits enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read published outfits" on public.outfits;
create policy "Public can read published outfits"
  on public.outfits for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admin can read all outfits" on public.outfits;
create policy "Admin can read all outfits"
  on public.outfits for select
  to authenticated
  using (true);

drop policy if exists "Admin can insert outfits" on public.outfits;
create policy "Admin can insert outfits"
  on public.outfits for insert
  to authenticated
  with check (true);

drop policy if exists "Admin can update outfits" on public.outfits;
create policy "Admin can update outfits"
  on public.outfits for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin can delete outfits" on public.outfits;
create policy "Admin can delete outfits"
  on public.outfits for delete
  to authenticated
  using (true);

drop policy if exists "Public can read products of published outfits" on public.products;
create policy "Public can read products of published outfits"
  on public.products for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.outfits
      where outfits.id = products.outfit_id
        and outfits.published = true
    )
  );

drop policy if exists "Admin can read all products" on public.products;
create policy "Admin can read all products"
  on public.products for select
  to authenticated
  using (true);

drop policy if exists "Admin can insert products" on public.products;
create policy "Admin can insert products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "Admin can update products" on public.products;
create policy "Admin can update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin can delete products" on public.products;
create policy "Admin can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- 3. Image storage
--
-- Creates a public bucket for outfit photos. Anyone can view an image (so it
-- can display on your public site and on Pinterest), but only a logged-in
-- user can upload, replace or delete files.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('outfit-images', 'outfit-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view outfit images" on storage.objects;
create policy "Public can view outfit images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'outfit-images');

drop policy if exists "Admin can upload outfit images" on storage.objects;
create policy "Admin can upload outfit images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'outfit-images');

drop policy if exists "Admin can update outfit images" on storage.objects;
create policy "Admin can update outfit images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'outfit-images');

drop policy if exists "Admin can delete outfit images" on storage.objects;
create policy "Admin can delete outfit images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'outfit-images');

-- ---------------------------------------------------------------------------
-- 4. One demo outfit
--
-- So you can see exactly how a card and its individual page look before you
-- publish anything of your own. Delete it from /admin/dashboard whenever
-- you're ready — the "Delete" button removes it completely.
-- ---------------------------------------------------------------------------

insert into public.outfits (slug, title, description, image_url, card_color, published, position)
values (
  'the-demo-edit',
  'The Demo Edit',
  'This is a sample look so you can see how Outfit&Co. works. Open it, then head to /admin to edit or delete it.',
  'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200&auto=format&fit=crop',
  '#F1DAD4',
  true,
  0
)
on conflict (slug) do nothing;

insert into public.products (outfit_id, name, url, position)
select id, 'Example Product', 'https://www.myntra.com', 0
from public.outfits where slug = 'the-demo-edit'
on conflict do nothing;
