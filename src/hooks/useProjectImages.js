import { useEffect, useState } from 'react';
import { fetchProjectImages } from '../lib/supabase';

const cache = new Map(); // project id -> images, so reopening a project is instant

export default function useProjectImages(project) {
  const fallback = project.image ? [{ src: project.image, alt: project.title }] : [];
  const [state, setState] = useState({
    images: cache.get(project.id) || fallback,
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
        const images = remote.length ? remote : fallback;
        cache.set(project.id, images);
        if (live) setState({ images, loading: false });
      })
      .catch(() => live && setState({ images: fallback, loading: false }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  return state;
}
