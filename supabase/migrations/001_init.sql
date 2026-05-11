-- Catalyst — Base Tables
-- Run this in the Supabase SQL Editor to create the initial schema.

-- business_profiles
create table if not exists business_profiles (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users on delete cascade,
  business_name    text,
  main_channel     text,
  product_category text,
  currency         text default 'IDR',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- checklist_progress
create table if not exists checklist_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users on delete cascade unique,
  completed_item_ids text[] default '{}',
  updated_at         timestamptz default now()
);

-- transactions
create table if not exists transactions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users on delete cascade,
  type             text check (type in ('income', 'expense')),
  category         text,
  note             text,
  amount           numeric,
  transaction_date date,
  created_at       timestamptz default now()
);

-- hpp_calculations
create table if not exists hpp_calculations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  mode       text check (mode in ('reseller', 'production')),
  inputs     jsonb,
  results    jsonb,
  created_at timestamptz default now()
);

-- roas_calculations
create table if not exists roas_calculations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  inputs     jsonb,
  results    jsonb,
  created_at timestamptz default now()
);

-- content_items
create table if not exists content_items (
  id           uuid primary key default gen_random_uuid(),
  type         text, -- 'roadmap', 'faq', 'checklist', 'ad_guide'
  slug         text unique,
  title        text,
  body         text,
  order_index  integer,
  is_published boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);