import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDataWithAuthorization } from '../api/get-data';
import { SEARCH_PARAM_TRUE } from '../constants/search-params';
import { FormInputs } from '../types/tag';
import { postDataWithAuthorization } from '../api/post-data';
import { putDataWithAuthorization } from '../api/put-data';

export function useTags() {
  const queryClient = useQueryClient();

  // FIXME duplicated code?
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

  const createTag = useMutation({
    mutationFn: (formData: FormInputs) =>
      postDataWithAuthorization('/tags', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'], exact: true });
    },
  });

  const deleteTag = useMutation({
    mutationFn: (uiid: string) =>
      putDataWithAuthorization(`/tags/${uiid}/delete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const restoreTag = useMutation({
    mutationFn: (uiid: string) =>
      putDataWithAuthorization(`/tags/${uiid}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return {
    queryTags,
    queryDeletedTags,
    createTag,
    deleteTag,
    restoreTag,
  };
}
