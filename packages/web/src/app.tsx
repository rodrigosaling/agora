/* eslint-disable react/jsx-props-no-spreading */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import './app.css';

const SERVER_URL = 'http://localhost:3000';

async function getData(url = '') {
  const response = await fetch(`${SERVER_URL}${url}`, {
    // method: 'GET',
    // headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

async function postData(url = '', data = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

async function putData(url = '', data = {}) {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

type Inputs = {
  name: string;
};

type Tags = {
  name: string;
  hash: string;
};

function App() {
  const queryClient = useQueryClient();

  const queryTags = useQuery({
    queryKey: ['tags'],
    queryFn: () => getData('/tags'),
  });

  const queryDeletedTags = useQuery({
    queryKey: ['tags', 'deleted'],
    queryFn: () => getData('/tags?deleted=true'),
  });

  const createTag = useMutation({
    mutationFn: (newTag) => postData('/tags', newTag),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tags'], exact: true });
    },
  });

  const deleteTag = useMutation({
    mutationFn: (hash) => putData(`/tags/${hash}/delete`),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const restoreTag = useMutation({
    mutationFn: (hash) => putData(`/tags/${hash}/restore`),
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
      <header>
        <h1 className="text-indigo ml-12 underline underline-dotted">Events</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>Reports</li>
            <li>Tags</li>
            <li>Preferences</li>
          </ul>
        </nav>
      </header>
      <hr />
      <main>
        <h2>Adicionar uma tag</h2>
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input
            {...register('name', { required: true })}
            id="name-something"
            data-1p-ignore
          />
          {/* include validation with required or other standard HTML validation rules */}
          {/* <input {...register('exampleRequired', { required: true })} /> */}
          {/* errors will return when field validation fails  */}
          {errors.name && <span>This field is required</span>}
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
              <li key={tag.hash}>
                {tag.name}
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => handleDelete(tag.hash)}
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
              <li key={tag.hash}>
                {tag.name}
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => handleRestore(tag.hash)}
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

export default App;
