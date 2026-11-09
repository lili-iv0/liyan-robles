import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import SectionTitle from '../components/SectionTitle';
import usePageTitle from '../hooks/usePageTitle';
import projects from '../data/projects';

export default function Projects() {
  usePageTitle('Projects');
  const [active, setActive] = useState('All');
  const [open, setOpen] = useState(null);

  const tags = useMemo(() => ['All', ...new Set(projects.flatMap((p) => p.tags))], []);
  const visible = active === 'All' ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <div className="container section">
      <SectionTitle kicker="Portfolio" title="Projects">
        Filter by technology. Select a project to see screenshots, source code, and a live demo where available.
      </SectionTitle>

      <div className="filters" role="group" aria-label="Filter projects by tech">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            className={`chip ${active === t ? 'active' : ''}`}
            aria-pressed={active === t}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="project-grid">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={setOpen} />
          ))}
        </div>
      ) : (
        <p className="empty">No projects use {active} yet. Add one in src/data/projects.js.</p>
      )}

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
