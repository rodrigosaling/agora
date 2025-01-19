import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/')({
  component: AppIndex,
});

function AppIndex() {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <a href="/app/">Home</a>
            </li>
            <li>
              <a href="/app/logout">Logout</a>
            </li>
          </ul>
        </nav>
      </header>
      <h1>Agora Dashboard</h1>

      <Outlet />
    </>
  );
}
