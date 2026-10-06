create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists app_users_email_lower_unique
  on public.app_users (lower(email));

alter table public.app_users enable row level security;
revoke all on table public.app_users from anon, authenticated;
grant select, insert on table public.app_users to service_role;

drop function if exists public.register_app_user(text, text, text);
drop function if exists public.login_app_user(text, text);
