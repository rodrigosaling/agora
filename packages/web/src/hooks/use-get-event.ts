import { useQuery } from '@tanstack/react-query';
import { getDataProps, getDataWithAuthorization } from '../api/get-data';

export function useGetEvent(uiid: string, params?: getDataProps) {
  const { searchParams } = params || {};
  return useQuery({
    queryKey: ['events', uiid, searchParams],
    queryFn: () =>
      getDataWithAuthorization({ url: `/events/${uiid}`, searchParams }),
  });
}
