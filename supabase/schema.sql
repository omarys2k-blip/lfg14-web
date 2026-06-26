-- ============================================================
-- LFG14 Web App — Database Schema
-- Paste this into the Supabase SQL editor and run it.
-- ============================================================

-- PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  gender text check (gender in ('Male', 'Female')),
  has_completed_onboarding boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-insert profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- GYM SESSIONS
create table if not exists gym_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  day_label text,
  gym_day_index int check (gym_day_index between 1 and 4),
  week int check (week in (1, 2)),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table gym_sessions enable row level security;

create policy "Users can manage own gym_sessions"
  on gym_sessions for all using (auth.uid() = user_id);


-- EXERCISE LOGS
create table if not exists exercise_logs (
  id uuid primary key default gen_random_uuid(),
  gym_session_id uuid not null references gym_sessions(id) on delete cascade,
  exercise_name text not null,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

alter table exercise_logs enable row level security;

create policy "Users can manage own exercise_logs"
  on exercise_logs for all
  using (
    exists (
      select 1 from gym_sessions gs
      where gs.id = exercise_logs.gym_session_id
        and gs.user_id = auth.uid()
    )
  );


-- SET LOGS
create table if not exists set_logs (
  id uuid primary key default gen_random_uuid(),
  exercise_log_id uuid not null references exercise_logs(id) on delete cascade,
  set_number int not null,
  weight_kg float not null default 0,
  reps int not null default 0,
  created_at timestamptz not null default now()
);

alter table set_logs enable row level security;

create policy "Users can manage own set_logs"
  on set_logs for all
  using (
    exists (
      select 1 from exercise_logs el
      join gym_sessions gs on gs.id = el.gym_session_id
      where el.id = set_logs.exercise_log_id
        and gs.user_id = auth.uid()
    )
  );


-- HOME SESSIONS
create table if not exists home_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  workout_label text,
  week int check (week in (1, 2)),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table home_sessions enable row level security;

create policy "Users can manage own home_sessions"
  on home_sessions for all using (auth.uid() = user_id);


-- STEP ENTRIES
create table if not exists step_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  steps int not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table step_entries enable row level security;

create policy "Users can manage own step_entries"
  on step_entries for all using (auth.uid() = user_id);


-- WEIGHT ENTRIES
create table if not exists weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight_kg float not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table weight_entries enable row level security;

create policy "Users can manage own weight_entries"
  on weight_entries for all using (auth.uid() = user_id);
