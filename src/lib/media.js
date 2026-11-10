// Turns a link into a gallery item, or null when it is not a video we can play.
//   YouTube / Vimeo link  -> { type: 'embed' }  (plays in an iframe)
//   direct .mp4/.webm URL -> { type: 'video' }  (plays in a <video> tag)
export const VIDEO_FILE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

export function toMediaItem(url, title = '') {
  if (!url) return null;
  const alt = `${title} video`.trim();

  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) {
    return {
      type: 'embed',
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}`,
      poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
      alt,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return { type: 'embed', src: `https://player.vimeo.com/video/${vimeo[1]}`, alt };

  if (VIDEO_FILE.test(url)) return { type: 'video', src: url, alt };
  return null;
}
