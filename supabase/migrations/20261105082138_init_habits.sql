-- Habits: one row per habit, owned by a user.
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  goal text not null default '',
  icon text not null check (icon in ('water', 'book', 'sun', 'leaf', 'moon')),
  hue text not null check (hue in ('blue', 'yellow', 'green', 'violet', 'pink')),
  time_of_day text not null check (time_of_day in ('morning', 'afternoon', 'evening')),
  -- Monday first, 7 items, same as Habit.days in the app.
  days boolean[] not null default '{t,t,t,t,t,t,t}' check (array_length(days, 1) = 7),
  created_at timestamptz not null default now()
);

-- Completions: a habit was done on a date. One row per habit per day.
create table public.completions (
  habit_id uuid not null references public.habits on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  created_at timestamptz not null default now(),
  primary key (habit_id, date)
);

create index habits_user_id_idx on public.habits (user_id);
create index completions_user_id_idx on public.completions (user_id);

-- Row level security: every user only sees and changes their own rows.
alter table public.habits enable row level security;
alter table public.completions enable row level security;

create policy "Users manage their own habits"
  on public.habits for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their own completions"
  on public.completions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = (select auth.uid())
    )
  );

-- Realtime: lets the app subscribe to changes (used in a later step).
alter publication supabase_realtime add table public.habits, public.completions;
