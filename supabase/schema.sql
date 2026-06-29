create extension if not exists "pgcrypto";

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  frequency text not null check (frequency in ('Daily', 'Weekdays', 'Weekly')),
  target_count integer not null default 1 check (target_count between 1 and 20),
  notes text not null default '',
  completed_today boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists habits_user_created_idx
  on public.habits (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists habits_set_updated_at on public.habits;

create trigger habits_set_updated_at
before update on public.habits
for each row
execute function public.set_updated_at();

alter table public.habits enable row level security;

drop policy if exists "Users can read their own habits" on public.habits;
create policy "Users can read their own habits"
on public.habits
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own habits" on public.habits;
create policy "Users can insert their own habits"
on public.habits
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own habits" on public.habits;
create policy "Users can update their own habits"
on public.habits
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own habits" on public.habits;
create policy "Users can delete their own habits"
on public.habits
for delete
using (auth.uid() = user_id);
