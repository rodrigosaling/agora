/* eslint-disable react/jsx-props-no-spreading */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getDataWithAuthorization } from '../api/get-data';
import { postDataWithAuthorization } from '../api/post-data';
import { putDataWithAuthorization } from '../api/put-data';
import Header from '../components/header';

type FormInputs = {
  names: string;
};

type Tags = {
  name: string;
  uiid: string;
};

export default function Tags() {
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

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (formData) => {
    createTag.mutate(formData);
  };

  const handleDelete = (uiid: string) => {
    deleteTag.mutate(uiid);
  };

  const handleRestore = (uiid: string) => {
    restoreTag.mutate(uiid);
  };

  return (
    <>
      <Header />
      <hr />
      <main>
        <h2>Adicionar uma tag</h2>
        <p>
          Utilize o campo abaixo para adicionar várias tags de uma só vez. Você
          pode separar elas com uma nova linha ou usando uma vírgula.
        </p>
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <textarea
            {...register('names', { required: true })}
            id="tags-bulk-insert"
            data-1p-ignore
            className="border p-2 rounded border-gray-300 rounded-md w-xs font-sans"
            placeholder="palavra1, palavra2, palavra3"
          />
          {/* include validation with required or other standard HTML validation rules */}
          {/* <input {...register('exampleRequired', { required: true })} /> */}
          {/* errors will return when field validation fails  */}
          {errors.names && <span>This field is required</span>}
          <button type="submit">Send</button>
          {createTag.isPending ? (
            <div>Adding todo...</div>
          ) : (
            <>
              {createTag.isError ? (
                <div>An error occurred: {createTag.error.message}</div>
              ) : null}

              {createTag.isSuccess ? <div>Todo added!</div> : null}
            </>
          )}
        </form>
        {queryTags.isError && <p>{queryTags.error.message}</p>}

        <h2>Tags cadastradas</h2>
        {queryTags.data && queryTags.data.length === 0 && (
          <p>Nenhuma tag cadastrada</p>
        )}
        <ul>
          {queryTags.data &&
            queryTags.data.map((tag: Tags) => (
              <li key={tag.uiid}>
                {tag.name}
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => handleDelete(tag.uiid)}
                >
                  delete
                </button>
              </li>
            ))}
        </ul>

        <h2>Tags apagadas</h2>
        {queryDeletedTags.isError && <p>{queryDeletedTags.error.message}</p>}
        {queryDeletedTags.data && queryDeletedTags.data.length === 0 && (
          <p>Nenhuma tag apagada</p>
        )}
        <ul>
          {queryDeletedTags.data &&
            queryDeletedTags.data.map((tag: Tags) => (
              <li key={tag.uiid}>
                {tag.name}
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => handleRestore(tag.uiid)}
                >
                  restore
                </button>
              </li>
            ))}
        </ul>
      </main>
      <hr />
      <footer>2023</footer>
    </>
  );
}
