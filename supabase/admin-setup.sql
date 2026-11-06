-- First create your admin account in Supabase Dashboard > Authentication > Users.
-- Replace the email below with that exact account email, then run this SQL.
-- The role is stored in app_metadata, which ordinary users cannot edit themselves.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'eyadwarda06@gmail.com';
