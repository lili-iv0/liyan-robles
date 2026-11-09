import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import usePageTitle from '../hooks/usePageTitle';
import profile from '../data/profile';

// profile.formspreeId can be the bare id ("xdeajdpe") or the full endpoint URL.
const formEndpoint = profile.formspreeId
  ? profile.formspreeId.startsWith('http')
    ? profile.formspreeId
    : `https://formspree.io/f/${profile.formspreeId}`
  : '';

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'GitHub', value: profile.github.replace('https://', ''), href: profile.github },
  { label: 'LinkedIn', value: profile.linkedin.replace('https://www.', ''), href: profile.linkedin },
];

export default function Contact() {
  usePageTitle('Contact');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error | mailto

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // No Formspree ID set: open the visitor's email app with the message filled in.
    if (!formEndpoint) {
      const body = `${data.message}\n\n${data.name} (${data.email})`;
      window.location.href =
        `mailto:${profile.email}?subject=${encodeURIComponent(data.subject || 'Hello from your portfolio')}` +
        `&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

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

        <form className="form" onSubmit={onSubmit}>
          <p className="form-title">New message</p>
          <div className="form-row">
            <label>
              Name
              <input className="field" name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input className="field" name="email" type="email" autoComplete="email" required />
            </label>
          </div>
          <label>
            Subject
            <input className="field" name="subject" type="text" autoComplete="off" />
          </label>
          <label>
            Message
            <textarea className="field" name="message" rows="5" required />
          </label>

          <button className="btn play" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          <p className="form-status" role="status">
            {status === 'sent' && 'Message sent. Thank you, I will be in touch.'}
            {status === 'error' && 'The message was not sent. Check your connection and try again, or email me directly.'}
            {status === 'mailto' && 'Your email app should open with the message ready to send.'}
          </p>
        </form>
      </div>
    </div>
  );
}
