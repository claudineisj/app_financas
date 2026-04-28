-- FinançasPessoais - Database Schema
-- Run this in the Supabase SQL Editor

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('receita', 'despesa')) not null,
  amount decimal(12,2) not null check (amount > 0),
  description text not null,
  category text not null,
  date date not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table transactions enable row level security;

-- RLS Policies
create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- Index for performance
create index if not exists transactions_user_date_idx on transactions(user_id, date desc);
