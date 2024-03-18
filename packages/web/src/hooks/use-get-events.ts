import { useQuery } from '@tanstack/react-query';
import { getDataProps, getDataWithAuthorization } from '../api/get-data';

export function useGetEvents(params?: getDataProps) {
  const { searchParams } = params || {};
  return useQuery({
    queryKey: ['events', searchParams],
    queryFn: () => getDataWithAuthorization({ url: '/events', searchParams }),
  });
}
