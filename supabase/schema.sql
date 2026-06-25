-- =====================================================================
-- Mesa para Luis — Supabase schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent). Order matters: tables → functions → policies.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) TABLES
-- ---------------------------------------------------------------------

-- Profiles: one row per auth user, holds the role.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  role         text not null default 'reader' check (role in ('admin', 'reader')),
  created_at   timestamptz not null default now()
);

-- Blog posts.
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  locale      text not null default 'es',
  title       text not null,
  excerpt     text,
  body        text not null default '',
  cover_image text,
  published   boolean not null default false,
  author_id   uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Recipes added through the admin panel (mirrors the site's recipe shape).
create table if not exists public.recipes (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  locale      text not null default 'es',
  cuisine     text,
  level       int  not null default 1 check (level between 1 and 5),
  time_mins   int  not null default 30,
  servings    int  not null default 2,
  difficulty  text not null default 'Medium' check (difficulty in ('Easy','Medium','Hard','Expert')),
  image       text,
  title       text not null,
  excerpt     text,
  intro       text,
  ingredients jsonb  not null default '[]'::jsonb,
  steps       jsonb  not null default '[]'::jsonb,
  tags        text[] not null default '{}',
  published   boolean not null default false,
  author_id   uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2) FUNCTIONS (created after the tables they reference exist)
-- ---------------------------------------------------------------------

-- Is the current user an admin?  SECURITY DEFINER so it can read profiles
-- without tripping row-level-security recursion inside policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Keep a logged-in reader from promoting themselves: only admins may change
-- role. When auth.uid() is null (SQL editor / service role / back office) the
-- change is allowed, so you can bootstrap the first admin.
create or replace function public.protect_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end $$;

-- Auto-create a reader profile whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'reader')
  on conflict (id) do nothing;
  return new;
end $$;

-- Generic updated_at touch.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- 3) ROW-LEVEL SECURITY + POLICIES
-- ---------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.posts    enable row level security;
alter table public.recipes  enable row level security;

-- profiles
drop policy if exists "profiles read own"   on public.profiles;
drop policy if exists "profiles read admin" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles read admin" on public.profiles for select using (public.is_admin());
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

-- posts
drop policy if exists "posts read"  on public.posts;
drop policy if exists "posts write" on public.posts;
create policy "posts read"  on public.posts for select using (published = true or public.is_admin());
create policy "posts write" on public.posts for all    using (public.is_admin()) with check (public.is_admin());

-- recipes
drop policy if exists "recipes read"  on public.recipes;
drop policy if exists "recipes write" on public.recipes;
create policy "recipes read"  on public.recipes for select using (published = true or public.is_admin());
create policy "recipes write" on public.recipes for all    using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4) TRIGGERS
-- ---------------------------------------------------------------------

drop trigger if exists trg_protect_role on public.profiles;
create trigger trg_protect_role before update on public.profiles
  for each row execute function public.protect_role();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists trg_posts_touch on public.posts;
create trigger trg_posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_recipes_touch on public.recipes;
create trigger trg_recipes_touch before update on public.recipes
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 5) STORAGE BUCKET for uploaded images (public read, admin-only write)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images read"   on storage.objects;
drop policy if exists "images insert" on storage.objects;
drop policy if exists "images update" on storage.objects;
drop policy if exists "images delete" on storage.objects;
create policy "images read"   on storage.objects for select using (bucket_id = 'images');
create policy "images insert" on storage.objects for insert with check (bucket_id = 'images' and public.is_admin());
create policy "images update" on storage.objects for update using (bucket_id = 'images' and public.is_admin());
create policy "images delete" on storage.objects for delete using (bucket_id = 'images' and public.is_admin());

-- =====================================================================
-- 6) MAKE YOURSELF ADMIN
-- After signing up once in the app with your email, run (with your address):
--
--   update public.profiles set role = 'admin'
--   where email = 'tu-correo@ejemplo.com';
-- =====================================================================
