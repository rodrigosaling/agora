import { useQuery } from '@tanstack/react-query';
import { getDataProps, getDataWithAuthorization } from '../api/get-data';

export function useReportsSearch(params?: getDataProps) {
  const { searchParams } = params || {};
  return useQuery({
    queryKey: ['reportsSearch', searchParams],
    queryFn: () =>
      getDataWithAuthorization({ url: '/reports/search', searchParams }),
    enabled: !!searchParams?.q,
  });
}
