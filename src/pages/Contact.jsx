import { useEffect, useRef, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import usePageTitle from '../hooks/usePageTitle';
import profile from '../data/profile';
import { hasSupabase, uploadContactImage } from '../lib/supabase';

// Web3Forms is used when profile.web3formsKey is set; otherwise Formspree (id or full URL); otherwise mailto.
const WEB3_URL = 'https://api.web3forms.com/submit';
const formspreeUrl = profile.formspreeId
  ? profile.formspreeId.startsWith('http')
    ? profile.formspreeId
    : `https://formspree.io/f/${profile.formspreeId}`
  : '';
const formEndpoint = profile.web3formsKey ? WEB3_URL : formspreeUrl;

const MAX_FILES = 3;
const MAX_MB = 5;
const OK_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'GitHub', value: profile.github.replace('https://', ''), href: profile.github },
  { label: 'LinkedIn', value: profile.linkedin.replace('https://www.', ''), href: profile.linkedin },
];

export default function Contact() {
  usePageTitle('Contact');
  const [status, setStatus] = useState('idle'); // idle | uploading | sending | sent | error | uploaderror | mailto
  const [files, setFiles] = useState([]);       // [{ id, file, url }]
  const [notice, setNotice] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);
  const latest = useRef(files);
  latest.current = files;

  // free the preview URLs when leaving the page
  useEffect(() => () => latest.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  function addFiles(list) {
    const next = [...files];
    const problems = [];
    for (const file of list) {
      if (!OK_TYPES.includes(file.type)) problems.push(`${file.name} is not a PNG, JPG, WebP or GIF picture.`);
      else if (file.size > MAX_MB * 1024 * 1024) problems.push(`${file.name} is larger than ${MAX_MB} MB.`);
      else if (next.length >= MAX_FILES) problems.push(`You can attach up to ${MAX_FILES} pictures.`);
      else next.push({ id: `${file.name}-${file.size}-${file.lastModified}`, file, url: URL.createObjectURL(file) });
    }
    setFiles(next);
    setNotice([...new Set(problems)].join(' '));
  }

  function removeFile(id) {
    const gone = files.find((f) => f.id === id);
    if (gone) URL.revokeObjectURL(gone.url);
    setFiles(files.filter((f) => f.id !== id));
    setNotice('');
  }

  function clearFiles() {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setNotice('');
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (hasSupabase && e.dataTransfer?.files?.length) addFiles([...e.dataTransfer.files]);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data._gotcha) return; // hidden spam trap: real visitors never fill it

    // 1) upload the pictures (if any) and collect their links
    let links = [];
    if (files.length) {
      setStatus('uploading');
      try {
        links = await Promise.all(files.map((f) => uploadContactImage(f.file)));
      } catch {
        setStatus('uploaderror');
        return;
      }
    }
    const message = links.length
      ? `${data.message}\n\nPictures:\n${links.map((u, i) => `${i + 1}. ${u}`).join('\n')}`
      : data.message;

    // 2) no Formspree ID: open the visitor's email app with the message filled in
    if (!formEndpoint) {
      const body = `${message}\n\n${data.name} (${data.email})`;
      window.location.href =
        `mailto:${profile.email}?subject=${encodeURIComponent(data.subject || 'Hello from your portfolio')}` +
        `&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
      return;
    }

    // 3) send through Web3Forms (or Formspree)
    setStatus('sending');
    try {
      const subject = data.subject || `New message from ${data.name}`;
      const payload = profile.web3formsKey
        ? { access_key: profile.web3formsKey, from_name: data.name, name: data.name, email: data.email, subject, message }
        : { name: data.name, email: data.email, _subject: subject, message };
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success !== false) {
        setStatus('sent');
        form.reset();
        clearFiles();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  function discard() {
    fileInput.current?.form?.reset();
    clearFiles();
    setStatus('idle');
  }

  const busy = status === 'uploading' || status === 'sending';

  return (
    <div className="container section">
      <SectionTitle kicker="Say hello" title="Contact">
        Hiring, collaborating, or have a question? Send a message and I will reply within a few days.
      </SectionTitle>

      <div className="contact-grid">
        <ul className="channels">
          {channels.map((c) => (
            <li key={c.label}>
              <a className="channel" href={c.href} target={c.label === 'Email' ? undefined : '_blank'} rel="noreferrer">
                <strong>{c.label}</strong>
                <span className="muted">{c.value}</span>
              </a>
            </li>
          ))}
        </ul>

        <form
          className={`compose ${dragging ? 'dragging' : ''}`}
          onSubmit={onSubmit}
          onDragOver={(e) => { if (hasSupabase) { e.preventDefault(); setDragging(true); } }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }}
          onDrop={onDrop}
        >
          <div className="compose-head">New message</div>

          <div className="compose-row">
            <span className="compose-label">To</span>
            <span className="compose-chip">{profile.name} &lt;{profile.email}&gt;</span>
          </div>
          <div className="compose-row">
            <label className="compose-label" htmlFor="c-name">Name</label>
            <input id="c-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="compose-row">
            <label className="compose-label" htmlFor="c-email">From</label>
            <input id="c-email" name="email" type="email" autoComplete="email" placeholder="your email" required />
          </div>
          <div className="compose-row">
            <label className="compose-label" htmlFor="c-subject">Subject</label>
            <input id="c-subject" name="subject" type="text" autoComplete="off" />
          </div>

          <textarea
            className="compose-body"
            name="message"
            rows="8"
            placeholder="Write your message…"
            aria-label="Message"
            required
          />

          <input className="hp" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          {files.length > 0 && (
            <ul className="attachments" aria-label="Attached pictures">
              {files.map((f) => (
                <li key={f.id} className="attachment">
                  <img src={f.url} alt="" />
                  <span className="attachment-info">
                    <span className="attachment-name">{f.file.name}</span>
                    <span className="attachment-size">{fmtSize(f.file.size)}</span>
                  </span>
                  <button type="button" className="attachment-x" onClick={() => removeFile(f.id)} aria-label={`Remove ${f.file.name}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="compose-foot">
            <button className="btn play" type="submit" disabled={busy}>
              {status === 'uploading' ? 'Uploading…' : status === 'sending' ? 'Sending…' : 'Send'}
            </button>

            {hasSupabase && (
              <>
                <input
                  ref={fileInput}
                  type="file"
                  accept={OK_TYPES.join(',')}
                  multiple
                  hidden
                  onChange={(e) => { addFiles([...e.target.files]); e.target.value = ''; }}
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => fileInput.current?.click()}
                  disabled={busy || files.length >= MAX_FILES}
                  aria-label="Attach pictures"
                  title="Attach pictures"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
                    <path d="M20 11.5 11.8 19.7a5 5 0 0 1-7.1-7.1l9-9a3.3 3.3 0 0 1 4.7 4.7l-9 9a1.7 1.7 0 0 1-2.4-2.4l8.2-8.2" />
                  </svg>
                </button>
                <span className="compose-hint">Up to {MAX_FILES} pictures, {MAX_MB} MB each. Drag them in or tap the clip.</span>
              </>
            )}

            <button type="button" className="icon-btn compose-discard" onClick={discard} disabled={busy} aria-label="Discard message" title="Discard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
                <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>

          <p className="form-status" role="status">
            {notice && <span className="form-warn">{notice} </span>}
            {status === 'sent' && 'Message sent. Thank you, I will be in touch.'}
            {status === 'error' && 'The message was not sent. Check your connection and try again, or email me directly.'}
            {status === 'uploaderror' && 'The pictures could not be uploaded. Remove them and send again, or email me directly.'}
            {status === 'mailto' && 'Your email app should open with the message ready to send.'}
          </p>
        </form>
      </div>
    </div>
  );
}
