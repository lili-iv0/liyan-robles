import { useEffect, useState } from 'react';
import { fetchProjectImages } from '../lib/supabase';
import { toMediaItem } from '../lib/media';

const cache = new Map(); // project id -> gallery items, so reopening a project is instant

// Gallery items for one project: [video from projects.js] + [Supabase files, or the local image]
export default function useProjectImages(project) {
  const videoItem = toMediaItem(project.video, project.title);
  const lead = videoItem ? [videoItem] : [];
  const fallback = project.image ? [{ type: 'image', src: project.image, alt: project.title }] : [];
  const [state, setState] = useState({
    images: cache.get(project.id) || [...lead, ...fallback],
    loading: !cache.has(project.id),
  });

  useEffect(() => {
    let live = true;
    if (cache.has(project.id)) {
      setState({ images: cache.get(project.id), loading: false });
      return undefined;
    }
    fetchProjectImages(project.id)
      .then((remote) => {
        const images = [...lead, ...(remote.length ? remote : fallback)];
        cache.set(project.id, images);
        if (live) setState({ images, loading: false });
      })
      .catch(() => live && setState({ images: [...lead, ...fallback], loading: false }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  return state;
}
