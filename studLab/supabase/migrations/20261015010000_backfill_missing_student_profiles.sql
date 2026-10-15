insert into public.profiles (
  id,
  name,
  surname,
  cellphone_number,
  country,
  date_of_birth,
  address
)
select
  users.id,
  coalesce(users.raw_user_meta_data ->> 'name', ''),
  coalesce(users.raw_user_meta_data ->> 'surname', ''),
  coalesce(users.raw_user_meta_data ->> 'cellphone_number', ''),
  coalesce(users.raw_user_meta_data ->> 'country', ''),
  nullif(users.raw_user_meta_data ->> 'date_of_birth', '')::date,
  coalesce(users.raw_user_meta_data ->> 'address', '')
from auth.users as users
where not exists (
  select 1
  from public.profiles as profiles
  where profiles.id = users.id
)
on conflict (id) do nothing;
