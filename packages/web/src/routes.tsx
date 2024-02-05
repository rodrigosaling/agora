import { createBrowserRouter } from 'react-router-dom';

import Login from './pages/login';
import Home from './pages/home';
import Logout from './pages/logout';
import Tags from './pages/tags';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/tags',
    element: <Tags />,
  },
  {
    path: '/reports',
    element: <div>Reports</div>,
  },
  {
    path: '/preferences',
    element: <div>Preferences</div>,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]);

export default router;
