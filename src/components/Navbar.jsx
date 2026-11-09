import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import profile from '../data/profile';

// Pixel laptop logo (edit the rows or colours to change it)
const palette = { o: '#15123f', b: '#3a2cc0', h: '#8b86ec', g: '#5fe3a1', y: '#ffd257', L: '#d8d8ec' };
const rows = [
  '.oooooooooooo.',
  '.obbbbbbbbbbo.',
  '.obhhbbbbbbbo.',
  '.obbggbbbbbbo.',
  '.obbbbyybbbbo.',
  '.obbggggbbbbo.',
  '.obbbbbbbbbbo.',
  '.oooooooooooo.',
  'oLLLLLLLLLLLLo',
  '.oooooooooooo.',
];

function Logo({ size = 3 }) {
  const cells = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (palette[ch]) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" style={{ fill: palette[ch] }} />);
    });
  });
  return (
    <svg
      className="logo"
      width={rows[0].length * size}
      height={rows.length * size}
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {cells}
    </svg>
  );
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);

  // close the mobile menu when the page changes or Esc is pressed
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <Logo />
          <span className="brand-name">{profile.name}</span>
        </Link>

        <nav id="site-nav" className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={close}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && <button type="button" className="nav-scrim" aria-label="Close menu" onClick={close} tabIndex={-1} />}
    </header>
  );
}
