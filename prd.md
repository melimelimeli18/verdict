<!-- DO NOT DELETE THIS FILES -->

# Product Requirements Document

## Product Name

Catalyst

## Summary

Catalyst is a web app for early-stage Indonesian online sellers who need a simple operating dashboard to plan, track, and improve their business. The product combines a guided business checklist, ad evaluation tools, financial tracking, HPP/pricing calculators, a 5-year business roadmap, and practical Q&A content.

The current prototype is a single-page HTML app. The production version should be rebuilt using React with Supabase (PostgreSQL + Auth) and Netlify serverless functions so each user can save their own progress, financial records, calculator histories, and business settings — all without credit card requirements or separate backend hosting.

## Goals

- Help beginner online sellers know what to do next when starting or growing a store.
- Replace scattered notes and manual spreadsheets with one focused business tracker.
- Make core business numbers easy to understand: revenue, expenses, profit, margin, ROAS, HPP, ad spend ratio, and operational ratio.
- Save user progress across devices with account-based login.
- Provide a clean foundation for future features such as dashboards, reminders, exports, and marketplace integrations.

## Non-Goals

- Direct integration with Shopee, TikTok Shop, Tokopedia, or Meta Ads in the MVP.
- Accounting-grade bookkeeping or tax reporting.
- Multi-user company workspaces in the first release.
- Automated financial advice requiring regulated financial compliance.

## Target Users

### Primary User

Beginner to intermediate Indonesian online sellers who sell through marketplaces such as Shopee, TikTok Shop, Tokopedia, Instagram, or WhatsApp.

### User Pain Points

- They do not know the correct sequence for starting an online business.
- They often run ads before their store, pricing, reviews, and product pages are ready.
- They calculate profit too simply and forget packaging, platform fees, shipping subsidy, ads, and operational costs.
- Their financial records are scattered or not recorded at all.
- They need practical guidance, not complicated enterprise tools.

## Core Value Proposition

Bisnis Online gives small sellers a clear operating system: what to do, what to measure, and when to scale.

## MVP Features

### 1. Authentication

Users must be able to sign in with Google OAuth.

Requirements:

- Sign in with Google.
- Create user account automatically on first login.
- Store user profile: name, email, avatar, Google account ID.
- Maintain secure session with HTTP-only cookies or JWT strategy.
- Allow logout.
- Protect all private user data behind authentication.

### 2. Business Checklist

Users can track progress through business setup phases.

Current phases from prototype:

- Foundation and product readiness.
- Store setup and listing optimization.
- Organic traffic and content.
- Marketplace trust signals.
- Paid ads and scaling readiness.

Requirements:

- Show checklist grouped by phases.
- Mark checklist items as done or undone.
- Calculate total progress percentage.
- Show phase completion state.
- Reset checklist progress.
- Save progress per authenticated user.

### 3. Ad Evaluation

Users can learn and evaluate basic ad performance.

Requirements:

- Explain key ad metrics: ROAS, CTR, CPC, CPA, impressions.
- Provide decision guidance based on metric performance.
- Include checklist before running ads.
- Provide ROAS calculator using ad budget, revenue, selling price, COGS, and estimated fees.
- Show verdict: profitable, needs optimization, or stop campaign.

### 4. Financial Tracker

Users can record simple business income and expenses.

Requirements:

- Add income transaction.
- Add expense transaction.
- Choose transaction category.
- Add date, note, and amount.
- Delete transaction.
- Filter by all, income, or expense.
- Show total income, total expense, and net profit.
- Show financial health indicators:
  - profit margin
  - ad spend ratio
  - operational expense ratio
- Save all transactions per authenticated user.

### 5. HPP and Pricing Calculator

Users can calculate full product cost and expected margin.

Requirements:

- Support reseller mode.
- Support self-production mode.
- Include costs:
  - product purchase or raw materials
  - supplier shipping
  - labor
  - overhead
  - packaging
  - bubble wrap or tape
  - platform fee percentage
  - shipping subsidy
  - ad cost per item
- Allow manual ad cost per item.
- Allow automatic ad cost estimate from daily ad budget and target orders.
- Calculate:
  - total HPP
  - profit per item
  - margin percentage
  - suggested minimum selling price
- Show cost breakdown by component.
- Show pricing verdict.

### 6. 5-Year Roadmap

Users can view a practical business growth roadmap.

Requirements:

- Show roadmap by year or stage.
- Include stage goals, milestones, revenue targets, and decision points.
- Keep roadmap content editable from database or admin seed data for future iteration.

### 7. Q&A Knowledge Base

Users can browse common questions about starting, funding, ads, pricing, and scaling.

Requirements:

- Show accordion-style FAQ.
- Group questions by topic if content grows.
- Keep Q&A content seedable from database.

## Recommended Tech Stack

### Frontend

- React
- Vite
- React Router
- TanStack Query for API data fetching
- Supabase JS SDK for database and auth
- CSS Modules or Tailwind CSS
- Recharts for charts and financial breakdowns

### Backend / API

- Supabase Auth (Google OAuth built-in, no manual JWT or session wiring)
- Supabase PostgreSQL (Row Level Security for per-user data isolation)
- Netlify Functions (serverless, Node.js — for payment proxy and any logic that must run server-side)
- Zod for request validation in functions

### Database

- Supabase PostgreSQL (free tier, unlimited reads/writes, no credit card required)
- Row Level Security policies instead of manual `userId` filters in every query

### Deployment

- Frontend + Functions: Netlify monorepo (single deploy, same domain, no CORS)
- Database: Supabase managed PostgreSQL

## Goals

- Help beginner online sellers know what to do next when starting or growing a store.
- Replace scattered notes and manual spreadsheets with one focused business tracker.
- Make core business numbers easy to understand: revenue, expenses, profit, margin, ROAS, HPP, ad spend ratio, and operational ratio.
- Save user progress across devices with account-based login.
- Provide a clean foundation for future features such as dashboards, reminders, exports, and marketplace integrations.

## Non-Goals

- Direct integration with Shopee, TikTok Shop, Tokopedia, or Meta Ads in the MVP.
- Accounting-grade bookkeeping or tax reporting.
- Multi-user company workspaces in the first release.
- Automated financial advice requiring regulated financial compliance.

## Target Users

### Primary User

Beginner to intermediate Indonesian online sellers who sell through marketplaces such as Shopee, TikTok Shop, Tokopedia, Instagram, or WhatsApp.

### User Pain Points

- They do not know the correct sequence for starting an online business.
- They often run ads before their store, pricing, reviews, and product pages are ready.
- They calculate profit too simply and forget packaging, platform fees, shipping subsidy, ads, and operational costs.
- Their financial records are scattered or not recorded at all.
- They need practical guidance, not complicated enterprise tools.

## Core Value Proposition

Bisnis Online gives small sellers a clear operating system: what to do, what to measure, and when to scale.

## MVP Features

### 1. Authentication

Users must be able to sign in with Google OAuth.

Requirements:

- Sign in with Google.
- Create user account automatically on first login.
- Store user profile: name, email, avatar, Google account ID.
- Maintain secure session with HTTP-only cookies or JWT strategy.
- Allow logout.
- Protect all private user data behind authentication.

### 2. Business Checklist

Users can track progress through business setup phases.

Current phases from prototype:

- Foundation and product readiness.
- Store setup and listing optimization.
- Organic traffic and content.
- Marketplace trust signals.
- Paid ads and scaling readiness.

Requirements:

- Show checklist grouped by phases.
- Mark checklist items as done or undone.
- Calculate total progress percentage.
- Show phase completion state.
- Reset checklist progress.
- Save progress per authenticated user.

### 3. Ad Evaluation

Users can learn and evaluate basic ad performance.

Requirements:

- Explain key ad metrics: ROAS, CTR, CPC, CPA, impressions.
- Provide decision guidance based on metric performance.
- Include checklist before running ads.
- Provide ROAS calculator using ad budget, revenue, selling price, COGS, and estimated fees.
- Show verdict: profitable, needs optimization, or stop campaign.

### 4. Financial Tracker

Users can record simple business income and expenses.

Requirements:

- Add income transaction.
- Add expense transaction.
- Choose transaction category.
- Add date, note, and amount.
- Delete transaction.
- Filter by all, income, or expense.
- Show total income, total expense, and net profit.
- Show financial health indicators:
  - profit margin
  - ad spend ratio
  - operational expense ratio
- Save all transactions per authenticated user.

### 5. HPP and Pricing Calculator

Users can calculate full product cost and expected margin.

Requirements:

- Support reseller mode.
- Support self-production mode.
- Include costs:
  - product purchase or raw materials
  - supplier shipping
  - labor
  - overhead
  - packaging
  - bubble wrap or tape
  - platform fee percentage
  - shipping subsidy
  - ad cost per item
- Allow manual ad cost per item.
- Allow automatic ad cost estimate from daily ad budget and target orders.
- Calculate:
  - total HPP
  - profit per item
  - margin percentage
  - suggested minimum selling price
- Show cost breakdown by component.
- Show pricing verdict.

### 6. 5-Year Roadmap

Users can view a practical business growth roadmap.

Requirements:

- Show roadmap by year or stage.
- Include stage goals, milestones, revenue targets, and decision points.
- Keep roadmap content editable from database or admin seed data for future iteration.

### 7. Q&A Knowledge Base

Users can browse common questions about starting, funding, ads, pricing, and scaling.

Requirements:

- Show accordion-style FAQ.
- Group questions by topic if content grows.
- Keep Q&A content seedable from database.

## Supabase (PostgreSQL) Recommendation

Supabase is a better fit for this project than MongoDB.

Reasons:

- Every data model has a `userId` foreign key — a relational structure. PostgreSQL handles joins naturally.
- Financial summaries (total income, expenses, profit margin) are single SQL queries instead of reading every document and calculating in JavaScript.
- Google OAuth is built into Supabase Auth. No Passport.js, no manual session handling, no JWT wiring.
- Row Level Security (RLS) enforces per-user data isolation at the database level — no need to manually filter by `userId` in every query.
- Unlimited reads and writes on the free tier — no per-operation cost.
- No credit card required to get started.

Main caution:

Financial records should still be modeled carefully. Use transaction rows with clear fields, timestamps, and validation. Never hard-delete financial data — use soft deletes or immutable append-only tables where needed.

## Suggested Data Models

User accounts are managed by Supabase Auth (`auth.users` table). Application data uses the following PostgreSQL tables:

### business_profiles

- `id`: uuid, primary key
- `user_id`: uuid, foreign key → auth.users
- `business_name`: text
- `main_channel`: text
- `product_category`: text
- `currency`: text, default 'IDR'
- `created_at`: timestamptz
- `updated_at`: timestamptz

### checklist_progress

- `id`: uuid, primary key
- `user_id`: uuid, foreign key → auth.users, unique (one row per user)
- `completed_item_ids`: text[] (array of completed checklist item IDs)
- `updated_at`: timestamptz

### transactions

- `id`: uuid, primary key
- `user_id`: uuid, foreign key → auth.users
- `type`: text, check constraint ('income' or 'expense')
- `category`: text
- `note`: text
- `amount`: numeric
- `transaction_date`: date
- `created_at`: timestamptz

### hpp_calculations

- `id`: uuid, primary key
- `user_id`: uuid, foreign key → auth.users
- `mode`: text, check constraint ('reseller' or 'production')
- `inputs`: jsonb
- `results`: jsonb
- `created_at`: timestamptz

### roas_calculations

- `id`: uuid, primary key
- `user_id`: uuid, foreign key → auth.users
- `inputs`: jsonb
- `results`: jsonb
- `created_at`: timestamptz

### content_items

- `id`: uuid, primary key
- `type`: text ('roadmap', 'faq', 'checklist', 'ad_guide')
- `slug`: text, unique
- `title`: text
- `body`: text
- `order_index`: integer
- `is_published`: boolean, default true
- `created_at`: timestamptz
- `updated_at`: timestamptz

## API Requirements

### Auth (Supabase Auth)

- Handled entirely by Supabase Auth SDK. No custom auth endpoints needed.
- Google OAuth sign-in via `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- Session management, token refresh, and logout are built into the Supabase client.

### Checklist

- **Frontend → Supabase SDK**: Read/write `checklist_progress` table directly via RLS-protected queries.
- Hook logic in `useChecklist.js` manages toggle and reset using Supabase client.

### Transactions

- **Frontend → Supabase SDK**: CRUD on `transactions` table directly via RLS.
- Financial summaries (totals, profit margin, ratios) computed with Supabase queries or SQL views.
- Hook logic in `useTransactions.js` manages add/delete/filter/summary.

### Calculators

- **Frontend → Supabase SDK**: Insert/read from `hpp_calculations` and `roas_calculations` tables.
- Calculation logic runs client-side in `useCalculators.js`.
- Results can be optionally saved to database for history.

### Content

- **Frontend → Supabase SDK**: Read from `content_items` table (public or authenticated-read).
- Roadmap and FAQ pages render content from database.
- Content can be seeded via migration SQL.

### Netlify Functions (Server-Side Only)

- `POST /api/verify-payment`: Payment webhook proxy (the only endpoint that must run server-side to protect secrets).
- All other logic runs client-side with Supabase SDK + RLS.

## Key User Flows

### First Login

1. User opens the app.
2. User clicks sign in with Google.
3. App creates or retrieves user account.
4. User lands on dashboard/checklist.
5. User progress and financial records are loaded from API.

### Track Business Setup

1. User opens checklist.
2. User marks items as completed.
3. Progress percentage updates immediately.
4. Backend saves progress.

### Record Transaction

1. User opens Keuangan page.
2. User selects income or expense.
3. User enters category, note, amount, and date.
4. App saves transaction.
5. Dashboard summaries and health ratios update.

### Calculate HPP

1. User opens HPP calculator.
2. User chooses reseller or production mode.
3. User fills cost components and selling price.
4. App calculates HPP, profit, margin, and minimum price.
5. User can optionally save calculation history.

## Success Metrics

- Activation: percentage of users who complete at least 5 checklist items.
- Retention: users who return within 7 days.
- Financial engagement: users who add at least 3 transactions.
- Calculator usage: number of ROAS and HPP calculations per user.
- Completion: percentage of users who finish all phase 1 checklist items.

## MVP Release Scope

Included:

- Google OAuth login.
- Authenticated dashboard shell.
- Checklist progress persistence.
- Financial transaction CRUD.
- ROAS calculator.
- HPP calculator.
- Static or seeded roadmap and FAQ content.
- Responsive mobile-first UI.

Deferred:

- Admin CMS.
- Marketplace API integrations.
- CSV/PDF export.
- Notifications and reminders.
- Multi-business workspaces.
- Team collaboration.
- Subscription billing.

## Security and Privacy Requirements

- Use HTTPS in production.
- Store OAuth secrets only in environment variables.
- Supabase handles session tokens automatically via the SDK.
- Validate all API inputs.
- Use Supabase Row Level Security (RLS) to restrict every query by `auth.uid()`.
- Only expose the Supabase anon key to the frontend. Never expose the service role key.
- Add rate limiting to auth and write endpoints.
- Sanitize user-provided notes before rendering.

## Open Questions

- Should users be able to manage more than one business?
- Should calculator results be saved automatically or only when the user clicks save?
- Should checklist content be fixed in code or editable from database?
- Should the first release support Indonesian only, or prepare for bilingual content?
- Should users be able to export finance records to CSV?

## Build Recommendation

Start with React + Supabase + Netlify. This stack eliminates credit card requirements, manual auth wiring, and separate backend hosting — all of which were blockers with the original MERN plan. Supabase PostgreSQL handles relational data naturally (every model has a `userId` foreign key), and Row Level Security removes the need for a middleware auth layer. Keep financial transactions as separate rows with clear fields, rely on Supabase Auth for session management, and avoid overbuilding marketplace integrations until the core tracker
