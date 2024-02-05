import { useState } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_PERSON_EMAIL,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from './constants/local-storage';
import { SERVER_URL } from './constants/server-url';
import router from './routes';

// type ProvidersProps = {
//   children: ReactNode;
// };

// FIXME make this NOT a global variable
let isRefreshingToken = false;

export default function Providers() {
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

  // [useState] This ensures that data is not shared between different users and
  // requests, while still only creating the QueryClient once per component lifecycle.
  // https://tanstack.com/query/v4/docs/framework/react/guides/ssr#using-hydration
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
