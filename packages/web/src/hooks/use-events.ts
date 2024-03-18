import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDataWithAuthorization } from '../api/get-data';
import { SEARCH_PARAM_TRUE } from '../constants/search-params';
import { FormInputs } from '../types/tag';
import { postDataWithAuthorization } from '../api/post-data';
import { putDataWithAuthorization } from '../api/put-data';

export function useEvents() {
  const BASE_URL = '/events';
  const QUERY_KEY = 'events';
  const queryClient = useQueryClient();

  const queryEvents = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getDataWithAuthorization({ url: BASE_URL }),
  });

  const queryDeletedEvents = useQuery({
    queryKey: [QUERY_KEY, 'deleted'],
    queryFn: () =>
      getDataWithAuthorization({
        url: BASE_URL,
        searchParams: { deleted: SEARCH_PARAM_TRUE },
      }),
  });

  const createEvent = useMutation({
    mutationFn: (formData: FormInputs) =>
      postDataWithAuthorization(BASE_URL, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: (uiid: string) =>
      putDataWithAuthorization(`${BASE_URL}/${uiid}/delete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const restoreEvent = useMutation({
    mutationFn: (uiid: string) =>
      putDataWithAuthorization(`${BASE_URL}/${uiid}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    queryEvents,
    queryDeletedEvents,
    createEvent,
    deleteEvent,
    restoreEvent,
  };
}
