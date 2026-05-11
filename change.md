# Catalyst — Tech Stack Migration

## Overview

The original PRD recommended a MERN stack with Passport.js for Google OAuth. During early development, several blockers were encountered:

- Google OAuth with MongoDB via Passport.js required manual wiring of sessions, JWT, cookies, and route protection — causing persistent issues maintaining authenticated state across requests.
- Cloud Firestore triggered a billing wall error even on the free tier, requiring a credit card to enable.
- Alternative backend hosting platforms (Render, Railway, Fly.io) all required a credit card upfront.

This document describes the updated stack that resolves these blockers for a zero-cost, zero-credit-card MVP.

---

## Updated Stack

| Layer      | Original PRD               | Updated                               |
| ---------- | -------------------------- | ------------------------------------- |
| Frontend   | React + Vite               | React + Vite (unchanged)              |
| Auth       | Passport.js + Google OAuth | Supabase Auth (Google OAuth built-in) |
| Database   | MongoDB Atlas              | Supabase PostgreSQL                   |
| ORM / SDK  | Mongoose                   | Supabase JS SDK                       |
| Backend    | Express.js server          | Netlify Functions                     |
| Deployment | Render / Railway / Fly.io  | Netlify (monorepo)                    |

---

## Why Supabase

Every data model in the PRD has a `userId` foreign key — that is a relational structure. Supabase (PostgreSQL) fits naturally:

- Financial summaries (total income, expenses, profit margin) are a single SQL query instead of reading every document and calculating in JavaScript.
- Unlimited reads and writes on the free tier — no per-operation cost like Firestore.
- Google OAuth is built into Supabase Auth. No Passport.js, no manual session handling, no JWT wiring.
- No credit card required to get started.

---

## Why Netlify Monorepo

A monorepo keeps the entire project — frontend, serverless functions, and database migrations — in one repository with one deploy.

- No separate backend hosting platform needed.
- No CORS configuration — frontend and functions share the same domain.
- `netlify dev` runs frontend and functions together locally.
- The only backend needed for MVP is two small functions for the payment proxy. Supabase handles auth and data directly from the frontend via Row Level Security.

---

## Project Structure

```
catalyst/
├── src/                          ← React frontend
│   ├── lib/
│   │   └── supabase.js           ← Supabase client, initialized once
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTransactions.js
│   │   ├── useChecklist.js
│   │   └── useCalculators.js
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx    ← redirects if not logged in
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Checklist.jsx
│   │   ├── Keuangan.jsx
│   │   ├── HppCalculator.jsx
│   │   ├── RoasCalculator.jsx
│   │   ├── Roadmap.jsx
│   │   └── FAQ.jsx
│   ├── App.jsx
│   └── main.jsx
├── netlify/
│   └── functions/
│       └── verify-payment.js     ← payment proxy logic
├── supabase/
│   └── migrations/
│       ├── 001_init.sql          ← base tables
│       └── 002_rls.sql           ← row level security policies
├── public/
│   └── _redirects
├── .env                          ← local env vars, never commit
├── .env.example                  ← env var template for new devs
├── netlify.toml                  ← build and redirect config
├── vite.config.js
└── package.json
```

---

## netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[dev]
  command = "npm run dev"
  port = 5173
  functions_port = 8888

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Database Schema

```sql
-- business_profiles
create table business_profiles (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users,
  business_name    text,
  main_channel     text,
  product_category text,
  currency         text default 'IDR',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- checklist_progress
create table checklist_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users unique,
  completed_item_ids text[],
  updated_at         timestamptz default now()
);

-- transactions
create table transactions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users,
  type             text check (type in ('income', 'expense')),
  category         text,
  note             text,
  amount           numeric,
  transaction_date date,
  created_at       timestamptz default now()
);

-- hpp_calculations
create table hpp_calculations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users,
  mode       text check (mode in ('reseller', 'production')),
  inputs     jsonb,
  results    jsonb,
  created_at timestamptz default now()
);

-- roas_calculations
create table roas_calculations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users,
  inputs     jsonb,
  results    jsonb,
  created_at timestamptz default now()
);

-- content_items
create table content_items (
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
```

---

## Environment Variables

```
# Prefix VITE_ to expose to React frontend
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# No VITE_ prefix — Netlify Functions only, never expose to frontend
SUPABASE_SERVICE_ROLE_KEY=
PAYMENT_PROVIDER_SECRET=
```

Set the same variables in Netlify under **Site Settings → Environment Variables**.

---

#

## Known Limitations

- **Supabase free tier pauses after 1 week of inactivity.** Manually unpause from the Supabase dashboard during the MVP testing period.
- **Netlify Functions are stateless.** Background jobs and websockets are not supported. Neither is needed for MVP.
- **No real-time sync.** A refetch after mutation is sufficient for Catalyst's use case.

---

## Build Order

1. Supabase project setup — create project, enable Google OAuth, run migration SQL.
2. Connect Supabase to React — initialize client, implement `useAuth`, add `ProtectedRoute`.
3. Business Checklist — simplest feature, validates auth and database end-to-end.
4. Financial Tracker — core value, validates SQL summaries and health ratio queries.
5. HPP and ROAS Calculators — input forms, calculation logic, save history.
6. Roadmap and FAQ — seed `content_items` table, render static content pages.
7. Deploy to Netlify — connect GitHub repo, set environment variables, verify build.
