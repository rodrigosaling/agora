/* eslint-disable react/jsx-props-no-spreading */
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import './app.css';

const SERVER_URL = 'http://localhost:3000';

async function getData(url = '') {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'GET',
    // mode: 'cors',
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

type Inputs = {
  name: string;
};

function App() {
  // const { isPending, isError, data, error } = useQuery({
  const { data } = useQuery({
    queryKey: ['get-tags'],
    queryFn: () => getData('/tags'),
  });

  const mutation = useMutation({
    mutationFn: (newTag) => postData('/tags', newTag),
  });

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <>
      <header>
        <h1>Tags</h1>

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
        </form>
        <h2>Tags cadastradas</h2>
        <ul>
          {data && data.map((tags) => <li key={tags.id}>{tags.name}</li>)}
        </ul>
      </main>
      <hr />
      <footer>2023</footer>
    </>
  );
}

export default App;
