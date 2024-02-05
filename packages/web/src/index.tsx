import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
// import '@unocss/reset/tailwind.css';
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';
import './index.css';

import Login from './pages/login';
import Home from './pages/home';
import Logout from './pages/logout';
import Tags from './pages/tags';
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_PERSON_EMAIL,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from './constants/local-storage';
import { SERVER_URL } from './constants/server-url';

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

// type ProvidersProps = {
//   children: ReactNode;
// };

// FIXME make this NOT a global variable
let isRefreshingToken = false;

function Providers() {
  // const router = useRouter();
  // const [isRefreshingToken, setIsRefreshingToken] = useState(false);

  const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN);

    if (!isRefreshingToken && refreshToken) {
      try {
        isRefreshingToken = true;

        const refreshResponse = await fetch(
          `${SERVER_URL}/login/refresh-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken,
              email: localStorage.getItem(LOCAL_STORAGE_PERSON_EMAIL),
            }),
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          await refreshResponse.json();

        if (accessToken && newRefreshToken) {
          localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
          localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, newRefreshToken);
        }
      } catch (error) {
        // If refreshing token fails, redirect back to the home page
        // router.replace('/');
        console.log('PROBLEM', error);
      } finally {
        isRefreshingToken = false;
      }
    }
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // staleTime: 30000, // 30 seconds
            retry: (failureCount, error) => {
              // Don't retry for certain error responses
              if (
                error?.response?.status === 400 ||
                error?.response?.status === 401
              ) {
                return false;
              }

              // Retry others just once
              return failureCount <= 1;
            },
          },
        },
        queryCache: new QueryCache({
          onError: async (error, query) => {
            if (
              error?.response?.status === 400 ||
              error?.response?.status === 401
            ) {
              await refreshAuthToken();
              queryClient.invalidateQueries({
                queryKey: query.queryKey,
                exact: true,
              });
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* {children} */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);
// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={router} />
//     </QueryClientProvider>
//   </React.StrictMode>
// );
