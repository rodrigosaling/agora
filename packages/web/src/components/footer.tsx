import { useState } from 'react';
import { postDataWithAuthorization } from '../api/post-data';

export function Footer() {
  const [rawQuery, setRawQuery] = useState('');
  const [response, setResponse] = useState('');

  async function handleQueryButton() {
    setResponse(await postDataWithAuthorization('/query', { rawQuery }));
  }

  return (
    <>
      <footer>2023</footer>
      <textarea
        name="rawQuery"
        id=""
        cols="90"
        rows="10"
        defaultValue={rawQuery}
        onChange={(event) => setRawQuery(event.target.value)}
        className="font-mono"
      />
      <button type="button" onClick={handleQueryButton}>
        query
      </button>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </>
  );
}
