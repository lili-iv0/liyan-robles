import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="container section notfound">
      <h1>Page not found</h1>
      <p className="nf-code">Error 404</p>
      <p className="muted">This page does not exist. It may have moved, or the link is wrong.</p>
      <Link className="btn play" to="/">Back to home</Link>
    </div>
  );
}
