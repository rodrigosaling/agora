import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';
import './index.css';

import Login from './pages/login';
import Home from './pages/home';
import Logout from './pages/logout';
import Tags from './pages/tags';

const queryClient = new QueryClient();

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
