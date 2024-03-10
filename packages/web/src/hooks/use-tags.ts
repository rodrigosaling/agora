import { useQuery } from '@tanstack/react-query';
import { getDataWithAuthorization } from '../api/get-data';
import { SEARCH_PARAM_TRUE } from '../constants/search-params';

export function useTags() {
  const queryTags = useQuery({
    queryKey: ['tags'],
    queryFn: () => getDataWithAuthorization({ url: '/tags' }),
  });

  const queryDeletedTags = useQuery({
    queryKey: ['tags', 'deleted'],
    queryFn: () =>
      getDataWithAuthorization({
        url: '/tags',
        searchParams: { deleted: SEARCH_PARAM_TRUE },
      }),
  });

  return {
    queryTags,
    queryDeletedTags,
  };
}
