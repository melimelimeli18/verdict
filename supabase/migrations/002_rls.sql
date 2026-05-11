-- Catalyst — Row Level Security Policies
-- Run this after 001_init.sql.

-- Enable RLS on all tables
alter table business_profiles enable row level security;
alter table checklist_progress enable row level security;
alter table transactions enable row level security;
alter table hpp_calculations enable row level security;
alter table roas_calculations enable row level security;
alter table content_items enable row level security;

-- business_profiles: users can only read/write their own profile
create policy "Users can view own profile"
  on business_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on business_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on business_profiles for update
  using (auth.uid() = user_id);

-- checklist_progress: users can only read/write their own progress
create policy "Users can view own progress"
  on checklist_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on checklist_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on checklist_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on checklist_progress for delete
  using (auth.uid() = user_id);

-- transactions: users can only read/write their own transactions
create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- hpp_calculations: users can only read/write their own calculations
create policy "Users can view own hpp calculations"
  on hpp_calculations for select
  using (auth.uid() = user_id);

create policy "Users can insert own hpp calculations"
  on hpp_calculations for insert
  with check (auth.uid() = user_id);

-- roas_calculations: users can only read/write their own calculations
create policy "Users can view own roas calculations"
  on roas_calculations for select
  using (auth.uid() = user_id);

create policy "Users can insert own roas calculations"
  on roas_calculations for insert
  with check (auth.uid() = user_id);

-- content_items: public read access for published items
create policy "Anyone can view published content"
  on content_items for select
  using (is_published = true);