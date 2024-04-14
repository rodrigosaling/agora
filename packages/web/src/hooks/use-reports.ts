import { useQuery } from '@tanstack/react-query';
import { getDataWithAuthorization } from '../api/get-data';
import { SEARCH_PARAM_TRUE } from '../constants/search-params';

export function useReports() {
  const BASE_URL = '/reports';
  const QUERY_KEY = 'reports';
  // const queryClient = useQueryClient();

  // const queryEvents = useQuery({
  //   queryKey: [QUERY_KEY],
  //   queryFn: () => getDataWithAuthorization({ url: BASE_URL }),
  // });

  function useSearch(query: string) {
    return useQuery({
      queryKey: [`${QUERY_KEY}Search`, query],
      queryFn: () =>
        getDataWithAuthorization({
          url: BASE_URL,
          searchParams: { deleted: SEARCH_PARAM_TRUE },
        }),
    });
  }

  return {
    useSearch,
  };
}
