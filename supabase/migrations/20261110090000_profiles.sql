-- Profiles: per-user settings, one row per user.
create table public.profiles (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  reminders_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users manage their own profile"
  on public.profiles for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
