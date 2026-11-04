import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The site still works without Supabase: it just falls back to the local images.
export const supabase = url && key ? createClient(url, key) : null;
export const hasSupabase = Boolean(supabase);

export const PROJECT_BUCKET = 'project-images'; // one folder per project id
export const SITE_BUCKET = 'site-images';       // about-me hover picture, etc.

const IMG = /\.(png|jpe?g|webp|gif|avif)$/i;

/**
 * Lists every image in  project-images/<projectId>/  sorted by file name,
 * so name them 01-home.png, 02-quiz.png, ... to control the order.
 * Returns [{ src, alt }] or [] when nothing is there / Supabase is off.
 */
export async function fetchProjectImages(projectId) {
  if (!supabase) return [];
  const { data, error } = await supabase.storage
    .from(PROJECT_BUCKET)
    .list(projectId, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) return [];

  return data
    .filter((f) => f.name && IMG.test(f.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map((f) => ({
      src: supabase.storage.from(PROJECT_BUCKET).getPublicUrl(`${projectId}/${f.name}`).data.publicUrl,
      alt: f.name.replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' '),
    }));
}

/** Public URL of one file in the site-images bucket, or '' when Supabase is off. */
export function siteImageUrl(path) {
  if (!supabase) return '';
  return supabase.storage.from(SITE_BUCKET).getPublicUrl(path).data.publicUrl;
}
