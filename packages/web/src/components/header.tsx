import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header>
      <h1 className="text-3xl font-bold text-violet-700">Agora</h1>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>
            <Link to="/tags">Tags</Link>
          </li>
          <li>Preferences</li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
