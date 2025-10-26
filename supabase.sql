-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique,
  full_name text,
  subscription_plan text default 'free',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy: users can view their own profile
create policy "Users can view their own profile"
on public.profiles for select
using (auth.uid() = id);

-- Policy: users can insert their own profile
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Policy: users can update their own profile
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);
