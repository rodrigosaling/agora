import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LOCAL_STORAGE_PERSON_EMAIL } from './constants/local-storage';

import Login from './pages/login';
import Home from './pages/home';
import Logout from './pages/logout';
import Tags from './pages/tags';
import Events from './pages/events';
import Reports from './pages/reports';
import EventDetails from './pages/event-details';

function ProtectedRoutes() {
  const personEmail = localStorage.getItem(LOCAL_STORAGE_PERSON_EMAIL);
  return personEmail ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ isUnauthorized: true }} />
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/tags',
        element: <Tags />,
      },
      {
        path: '/events/:uiid',
        element: <EventDetails />,
      },
      {
        path: '/events',
        element: <Events />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
      {
        path: '/preferences',
        element: <div>Preferences</div>,
      },
      {
        path: '/logout',
        element: <Logout />,
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]);

export default router;
