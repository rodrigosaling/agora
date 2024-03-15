import { useQuery } from '@tanstack/react-query';
import { getDataProps, getDataWithAuthorization } from '../api/get-data';

export function useGetTags(params?: getDataProps) {
  const { searchParams } = params || {};
  return useQuery({
    queryKey: ['tags', searchParams],
    queryFn: () => getDataWithAuthorization({ url: '/tags', searchParams }),
  });
}
