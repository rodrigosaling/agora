/* eslint-disable react/jsx-props-no-spreading */
import { useForm, SubmitHandler } from 'react-hook-form';
import { Header } from '../components/header';
import { FormInputs, Tag } from '../types/tag';
import { useTags } from '../hooks/use-tags';
import { DefaultTemplate } from '../templates/default';

export default function Tags() {
  const { queryTags, queryDeletedTags, createTag, restoreTag, deleteTag } =
    useTags();

  const {
    register,
    handleSubmit,
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
    <DefaultTemplate>
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
          queryTags.data.map((tag: Tag) => (
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
          queryDeletedTags.data.map((tag: Tag) => (
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
    </DefaultTemplate>
  );
}
