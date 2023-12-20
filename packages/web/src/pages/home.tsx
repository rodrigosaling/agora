/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getDataWithAuthorization } from '../api/get-data';
import { postDataWithAuthorization } from '../api/post-data';
import { putDataWithAuthorization } from '../api/put-data';
import Header from '../components/header';
import { Footer } from '../components/footer';

type Inputs = {
  name: string;
};

type Tags = {
  name: string;
  hash: string;
};

export default function Home() {
  const queryClient = useQueryClient();

  const queryTags = useQuery({
    queryKey: ['tags'],
    queryFn: () => getDataWithAuthorization('/tags'),
  });

  const queryDeletedTags = useQuery({
    queryKey: ['tags', 'deleted'],
    queryFn: () => getDataWithAuthorization('/tags?deleted=true'),
  });

  const createTag = useMutation({
    mutationFn: (formData) => postDataWithAuthorization('/tags', formData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tags'], exact: true });
    },
  });

  const deleteTag = useMutation({
    mutationFn: (hash) => putDataWithAuthorization(`/tags/${hash}/delete`),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const restoreTag = useMutation({
    mutationFn: (hash) => putDataWithAuthorization(`/tags/${hash}/restore`),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    createTag.mutate(formData);
  };

  const handleDelete = (hash: string) => {
    deleteTag.mutate(hash);
  };

  const handleRestore = (hash: string) => {
    restoreTag.mutate(hash);
  };

  return (
    <>
      <Header />
      <hr />
      <main />
      <hr />
      <Footer />
    </>
  );
}
