-- Archived habits are hidden from the daily list but keep their completions.
alter table public.habits add column archived_at timestamptz;
