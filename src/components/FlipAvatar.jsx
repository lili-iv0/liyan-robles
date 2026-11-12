import { useEffect, useState } from 'react';
import { siteImageUrl } from '../lib/supabase';
import aboutHover from '../assets/about-hover.png';

const names = ['about-hover.png', 'about-hover.jpg', 'about-hover.jpeg', 'about-hover.webp'];
// The bundled image comes first, so the flip always works. Supabase / public files are optional overrides-as-fallbacks.
const candidates = () => [aboutHover, ...names.flatMap((n) => [siteImageUrl(n), `/${n}`])].filter(Boolean);

function firstThatLoads(urls) {
  return new Promise((resolve) => {
    const tryNext = (k) => {
      if (k >= urls.length) return resolve('');
      const img = new Image();
      img.onload = () => resolve(urls[k]);
      img.onerror = () => tryNext(k + 1);
      img.src = urls[k];
    };
    tryNext(0);
  });
}

export default function FlipAvatar({ front, alt }) {
  const [back, setBack] = useState('');
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    let live = true;
    firstThatLoads(candidates()).then((url) => {
      if (live) setBack(url);
    });
    return () => { live = false; };
  }, []);

  if (!back) return <img src={front} alt={alt} className="avatar-img" />;

  return (
    <button
      type="button"
      className={`flip ${flipped ? 'is-flipped' : ''}`}
      onClick={() => setFlipped((f) => !f)}
      onBlur={() => setFlipped(false)}
      aria-pressed={flipped}
      aria-label={`${alt}. Press to see the other side.`}
    >
      <span className="flip-inner">
        <img className="flip-face" src={front} alt="" />
        <img className="flip-face flip-back" src={back} alt="" />
      </span>
    </button>
  );
}