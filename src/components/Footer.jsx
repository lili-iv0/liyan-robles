import { Link } from 'react-router-dom';
import profile from '../data/profile';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-copy">© {new Date().getFullYear()} {profile.name}</p>

        <nav className="footer-links" aria-label="Footer">
          <Link to="/projects">Projects</Link>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </nav>
      </div>
    </footer>
  );
}
