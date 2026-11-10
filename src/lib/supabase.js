import { createClient } from '@supabase/supabase-js';
import { VIDEO_FILE } from './media';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The site still works without Supabase: it just falls back to the local images.
export const supabase = url && key ? createClient(url, key) : null;
export const hasSupabase = Boolean(supabase);

export const PROJECT_BUCKET = 'project-images'; // one folder per project id
export const SITE_BUCKET = 'site-images';       // about-me hover picture, etc.

const IMG = /\.(png|jpe?g|webp|gif|avif)$/i;

/**
 * Lists every image AND video in  project-images/<projectId>/  sorted by file name,
 * so name them 01-home.png, 02-demo.mp4, ... to control the order.
 * Returns [{ type: 'image' | 'video', src, alt }] or [] when nothing is there / Supabase is off.
 */
export async function fetchProjectImages(projectId) {
  if (!supabase) return [];
  const { data, error } = await supabase.storage
    .from(PROJECT_BUCKET)
    .list(projectId, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) return [];

  return data
    .filter((f) => f.name && (IMG.test(f.name) || VIDEO_FILE.test(f.name)))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map((f) => ({
      type: VIDEO_FILE.test(f.name) ? 'video' : 'image',
      src: supabase.storage.from(PROJECT_BUCKET).getPublicUrl(`${projectId}/${f.name}`).data.publicUrl,
      alt: f.name.replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' '),
    }));
}

/** Public URL of one file in the site-images bucket, or '' when Supabase is off. */
export function siteImageUrl(path) {
  if (!supabase) return '';
  return supabase.storage.from(SITE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export const CONTACT_BUCKET = 'contact-uploads'; // pictures attached through the contact form

/**
 * Uploads one picture from the contact form and returns its public link.
 * Needs the contact-uploads bucket from supabase-setup.sql.
 */
export async function uploadContactImage(file) {
  if (!supabase) throw new Error('Supabase is not configured');
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'png';
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `${id}/${base}.${ext}`;

  const { error } = await supabase.storage
    .from(CONTACT_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from(CONTACT_BUCKET).getPublicUrl(path).data.publicUrl;
}
