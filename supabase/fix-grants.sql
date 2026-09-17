-- FIX: grant logged-in users base access to the tables.
-- Run this once in the Supabase SQL Editor (New query -> paste -> Run).
-- Safe to run even if some grants already exist.

grant usage on schema public to authenticated, anon;

-- Profiles: users read their own row and edit only their name/salon.
grant select on public.profiles to authenticated;
grant update (full_name, salon_name) on public.profiles to authenticated;

-- Module progress: users create and update their own progress.
grant select, insert, update on public.module_progress to authenticated;

-- Survey responses: users save and update their own answers.
grant select, insert, update on public.survey_responses to authenticated;

-- Row Level Security still restricts every one of these to the user's own
-- rows (admins can additionally read all). Grants open the door; the
-- policies decide which rows each person sees.
