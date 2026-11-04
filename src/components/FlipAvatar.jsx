import { useEffect, useState } from 'react';
import { siteImageUrl } from '../lib/supabase';

// Where the second picture can live, first match wins:
//   1. Supabase Storage:  site-images/about-hover.png
//   2. Local file:        public/about-hover.png
const candidates = () => [siteImageUrl('site-images/about-hover.png'), 'site-images/about-hover.png'].filter(Boolean);

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
    firstThatLoads(candidates()).then((url) => live && setBack(url));
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
