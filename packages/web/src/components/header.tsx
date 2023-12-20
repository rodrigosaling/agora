import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <h1 className="text-indigo ml-12 underline underline-dotted">Events</h1>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>Reports</li>
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
