import { useState } from 'react';
import { Link } from 'react-router-dom';
import CodePanel from '../components/CodePanel';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import Scene from '../components/Scene';
import SectionTitle from '../components/SectionTitle';
import usePageTitle from '../hooks/usePageTitle';
import profile from '../data/profile';
import projects from '../data/projects';

export default function Home() {
  usePageTitle();
  const [open, setOpen] = useState(null);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const shown = featured.length ? featured : projects.slice(0, 3);
  const availability = profile.now.find((n) => n.open);

  return (
    <>
      <section className="stage" aria-label="Introduction">
        <Scene />
        <div className="container hero">
          <div className="hero-copy">
            {availability && (
              <p className="pill">
                <span className="dot" aria-hidden="true" />
                {availability.value}
              </p>
            )}
            <p className="kicker">Hi, I’m</p>
            <h1>{profile.name}</h1>
            <p className="role">{profile.title}</p>
            <p className="lead">{profile.tagline}</p>

            <div className="cta-row">
              <Link className="btn play" to="/projects">View projects</Link>
              <Link className="btn btn-ghost" to="/contact">Contact me</Link>
              {profile.resumeUrl && (
                <a className="btn btn-ghost" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  Resume
                </a>
              )}
            </div>
          </div>

          <div className="hero-visual">
            <CodePanel />
          </div>
        </div>
      </section>

      <section className="container status-wrap" aria-labelledby="now-h">
        <h2 id="now-h" className="eyebrow now-title">Right now</h2>
        <div className="status-row">
          {profile.now.map((n) => (
            <dl key={n.label} className="status">
              <div>
                <dt>{n.label}</dt>
                <dd>{n.value}</dd>
              </div>
            </dl>
          ))}
        </div>
      </section>

      <section className="container section">
        <SectionTitle
          kicker="Selected work"
          title="Featured projects"
          action={<Link className="btn btn-ghost" to="/projects">All projects</Link>}
        >
          A few projects from coursework and personal work. Select one to see screenshots.
        </SectionTitle>

        <div className="project-grid">
          {shown.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={setOpen} />
          ))}
        </div>
      </section>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </>
  );
}
