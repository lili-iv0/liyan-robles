import { useCallback, useEffect, useRef, useState } from 'react';
import useProjectImages from '../hooks/useProjectImages';

export default function ProjectModal({ project, onClose }) {
  const { title, role, description, details, tags = [], github, demo, website } = project;
  const { images, loading } = useProjectImages(project);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [ratio, setRatio] = useState(null); // width / height of the image being shown
  const closeRef = useRef(null);
  const thumbsRef = useRef(null);
  const touchX = useRef(null);
  const n = images.length;

  const go = useCallback(
    (to) => {
      if (!n) return;
      const next = (to + n) % n;
      setDir(to > i || (i === n - 1 && next === 0) ? 1 : -1);
      setI(next);
    },
    [i, n]
  );

  // keyboard: arrows to browse, Esc to close, focus stays inside
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.target?.closest?.('video')) return; // arrows seek inside a playing video
      else if (e.key === 'ArrowRight') go(i + 1);
      else if (e.key === 'ArrowLeft') go(i - 1);
      else if (e.key === 'Tab') {
        const els = document.querySelectorAll('.modal [href], .modal button');
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, i, onClose]);

  // lock page scroll + restore focus
  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  // keep the active thumbnail in view
  useEffect(() => {
    thumbsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [i]);

  // preload neighbours so the slide never flashes empty
  useEffect(() => {
    [i + 1, i - 1].forEach((k) => {
      const next = images[(k + n) % n];
      if (next && next.type === 'image') new Image().src = next.src;
    });
  }, [i, images, n]);

  const onTouchStart = (e) => {
    // don't treat a drag on the video's seek bar as a swipe
    touchX.current = e.target.closest?.('video') ? null : e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    touchX.current = null;
  };

  const current = images[i];

  // Frame follows the picture's own shape (clamped so extreme panoramas / tall phone shots stay sensible).
  // Videos and embeds stay 16:9.
  const isPhoto = current && current.type !== 'video' && current.type !== 'embed';
  const frameRatio = isPhoto && ratio ? Math.min(Math.max(ratio, 0.75), 2.4) : 16 / 9;
  const onPhotoLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) setRatio(w / h);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={closeRef} type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close project">
          <span aria-hidden="true">✕</span>
        </button>

        <div className={`gallery ${n > 1 ? 'has-thumbs' : ''}`}>
          <div className="gallery-stage" style={{ aspectRatio: frameRatio }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {current?.type === 'video' && (
              <video
                key={current.src}
                className="gallery-media"
                src={current.src}
                controls
                playsInline
                preload="metadata"
                aria-label={current.alt || `${title} video`}
              />
            )}
            {current?.type === 'embed' && (
              <iframe
                key={current.src}
                className="gallery-media"
                src={current.src}
                title={current.alt || `${title} video`}
                loading="lazy"
                allow="accelerometer; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )}
            {current && current.type !== 'video' && current.type !== 'embed' && (
              <img
                key={current.src}
                className={`gallery-img ${dir > 0 ? 'from-right' : 'from-left'}`}
                src={current.src}
                onLoad={onPhotoLoad}
                alt={current.alt || `${title} screenshot ${i + 1}`}
              />
            )}
            {!current && <div className="gallery-empty">{loading ? 'Loading…' : 'No images yet'}</div>}

            {n > 1 && (
              <>
                <button type="button" className="icon-btn gallery-nav prev" onClick={() => go(i - 1)} aria-label="Previous">‹</button>
                <button type="button" className="icon-btn gallery-nav next" onClick={() => go(i + 1)} aria-label="Next">›</button>
              </>
            )}
            {n > 1 && (
              <span className={`gallery-count ${current?.type === 'image' ? '' : 'on-video'}`} aria-live="polite">{i + 1} / {n}</span>
            )}
          </div>

          {n > 1 && (
            <ul className="gallery-thumbs" ref={thumbsRef} aria-label="Screenshots and videos">
              {images.map((img, k) => (
                <li key={img.src}>
                  <button
                    type="button"
                    className={`gallery-thumb ${k === i ? 'on' : ''}`}
                    aria-current={k === i}
                    aria-label={`Show ${img.type === 'image' ? 'image' : 'video'} ${k + 1}`}
                    onClick={() => go(k)}
                  >
                    {img.type === 'video' && <video src={`${img.src}#t=0.5`} muted playsInline preload="metadata" tabIndex={-1} />}
                    {img.type === 'embed' && (img.poster ? <img src={img.poster} alt="" loading="lazy" /> : <span className="thumb-blank" />)}
                    {img.type !== 'video' && img.type !== 'embed' && <img src={img.src} alt="" loading="lazy" />}
                    {img.type !== 'image' && <span className="thumb-play" aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-body">
          {role && <p className="modal-role">{role}</p>}
          <h3 id="modal-title">{title}</h3>
          <p className="muted">{details || description}</p>

          <ul className="tag-list" aria-label="Tech stack">
            {tags.map((t) => <li key={t} className={`tag ${t === 'Ongoing' ? 'tag-live' : ''}`}>{t}</li>)}
          </ul>

          {(github || demo || website) && (
            <div className="project-links modal-links">
              {demo && <a className="btn btn-sm play" href={demo} target="_blank" rel="noreferrer">Live demo</a>}
              {website && <a className="btn btn-ghost btn-sm" href={website} target="_blank" rel="noreferrer">Website</a>}
              {github && <a className="btn btn-ghost btn-sm" href={github} target="_blank" rel="noreferrer">Source code</a>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
