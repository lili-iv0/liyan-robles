-- Run once in Supabase > SQL Editor.
-- Creates two PUBLIC buckets and lets anyone read (list + view) them.
-- Uploading stays locked: you do that from the dashboard.

insert into storage.buckets (id, name, public) values
  ('project-images', 'project-images', true),
  ('site-images',    'site-images',    true)
on conflict (id) do nothing;

create policy "Public can view portfolio images"
on storage.objects for select
using (bucket_id in ('project-images', 'site-images'));
