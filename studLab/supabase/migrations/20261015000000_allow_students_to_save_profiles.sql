alter table public.profiles enable row level security;
grant select, insert, update on table public.profiles to authenticated;

drop policy if exists "studlab_students_can_read_own_profile" on public.profiles;
create policy "studlab_students_can_read_own_profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "studlab_students_can_insert_own_profile" on public.profiles;
create policy "studlab_students_can_insert_own_profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "studlab_students_can_update_own_profile" on public.profiles;
create policy "studlab_students_can_update_own_profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_student_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    name,
    surname,
    cellphone_number,
    country,
    date_of_birth,
    address
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'surname', ''),
    coalesce(new.raw_user_meta_data ->> 'cellphone_number', ''),
    coalesce(new.raw_user_meta_data ->> 'country', ''),
    nullif(new.raw_user_meta_data ->> 'date_of_birth', '')::date,
    coalesce(new.raw_user_meta_data ->> 'address', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_student_profile on auth.users;
create trigger on_auth_user_created_student_profile
  after insert on auth.users
  for each row execute function public.handle_new_student_profile();
