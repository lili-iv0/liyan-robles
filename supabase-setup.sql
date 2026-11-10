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

-- Contact form pictures: visitors can UPLOAD (images only, 5 MB max) but nobody can list the bucket.
-- Links are random, so only you (in the message you receive) know where each file is.
-- Delete old files any time from Storage > contact-uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('contact-uploads', 'contact-uploads', true, 5242880,
   array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Visitors can upload contact pictures"
on storage.objects for insert to anon
with check (bucket_id = 'contact-uploads');
