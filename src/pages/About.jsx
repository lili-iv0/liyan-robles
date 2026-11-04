import SectionTitle from '../components/SectionTitle';
import FlipAvatar from '../components/FlipAvatar';
import usePageTitle from '../hooks/usePageTitle';
import profile from '../data/profile';
import { avatar } from '../data/sprites';

export default function About() {
  usePageTitle('About');

  return (
    <div className="container section">
      <div className="about-intro">
        <div className="about-text">
          <SectionTitle kicker="Player profile" title="About me">Background, skills, and education.</SectionTitle>
          <h3>{profile.name}, {profile.title}</h3>
          {profile.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {profile.resumeUrl && (
            <a className="btn btn-sm" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Resume
            </a>
          )}
        </div>
        <div className="about-avatar">
          <FlipAvatar front={avatar.src} alt={`ID card of ${profile.name}`} />
          <span className="avatar-shadow" aria-hidden="true" />
        </div>
      </div>

      <section aria-labelledby="skills-h" className="block-section">
        <p className="eyebrow">Inventory</p>
        <h2 id="skills-h" className="h-sm">Skills</h2>
        <div className="skill-groups">
          {profile.skills.map((g) => (
            <div key={g.group} className="skill-group">
              <h3>{g.group}</h3>
              <ul className="tag-list">
                {g.items.map((i) => (
                  <li key={i} className="tag">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="log-h" className="block-section">
        <p className="eyebrow">Quest log</p>
        <h2 id="log-h" className="h-sm">Education and experience</h2>
        <ol className="log">
          {profile.timeline.map((t) => (
            <li key={t.title}>
              <span className="log-when">{t.when}</span>
              <h3>{t.title}</h3>
              <p className="log-place">{t.place}</p>
              <p className="muted">{t.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}