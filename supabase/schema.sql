-- It's Not Gossip Training: database schema
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

-- ============================================================
-- 1. Profiles: one row per user, created automatically on signup
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  salon_name text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, salon_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'salon_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by admin policies. SECURITY DEFINER so it can read
-- profiles without tripping over row level security.
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ============================================================
-- 2. Module progress: one row per user per module
-- ============================================================
create table public.module_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  module_slug text not null,
  current_step integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, module_slug)
);

-- ============================================================
-- 3. Survey responses: pre and post training self-assessment
-- ============================================================
create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_slug text not null,
  phase text not null check (phase in ('pre', 'post')),
  answers jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, module_slug, phase)
);

-- ============================================================
-- 4. Row level security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.module_progress enable row level security;
alter table public.survey_responses enable row level security;

-- Base table privileges for logged-in users. Row Level Security (below)
-- then restricts access to each user's own rows. Both are required: grants
-- open the table, policies filter the rows. We do NOT rely on Supabase's
-- default privileges here, so setup is the same on every project.
grant usage on schema public to authenticated, anon;
grant select on public.profiles to authenticated;
grant update (full_name, salon_name) on public.profiles to authenticated;
grant select, insert, update on public.module_progress to authenticated;
grant select, insert, update on public.survey_responses to authenticated;

-- Profiles: users see and edit their own; admins can see everyone.
create policy "own profile select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "own profile update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Note: only full_name and salon_name were granted as updatable above, so
-- users cannot grant themselves admin even though the update policy exists.

-- Module progress: users manage their own; admins can read all.
create policy "own progress select" on public.module_progress
  for select using (auth.uid() = user_id or public.is_admin());

create policy "own progress insert" on public.module_progress
  for insert with check (auth.uid() = user_id);

create policy "own progress update" on public.module_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Survey responses: users write their own; admins can read all.
create policy "own survey select" on public.survey_responses
  for select using (auth.uid() = user_id or public.is_admin());

create policy "own survey insert" on public.survey_responses
  for insert with check (auth.uid() = user_id);

create policy "own survey update" on public.survey_responses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
