-- App versions per platform, read by the app on launch to suggest or force an update.
create table public.app_config (
  platform text primary key check (platform in ('ios', 'android', 'web')),
  latest_version text not null,
  min_version text not null,
  store_url text,
  updated_at timestamptz not null default now()
);

insert into public.app_config (platform, latest_version, min_version) values
  ('ios', '1.1.0', '1.0.0'),
  ('android', '1.1.0', '1.0.0'),
  ('web', '1.1.0', '1.0.0');

-- Anyone can read; changes only through Studio or the secret key.
alter table public.app_config enable row level security;

create policy "Anyone can read app config"
  on public.app_config for select to anon, authenticated
  using (true);
