/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Footer } from '../components/footer';
import Header from '../components/header';
import { useDebounce } from '../hooks/use-debounce';
import { useReportsSearch } from '../hooks/use-reports-search';

export default function Reports() {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const { data } = useReportsSearch({
    searchParams: { q: debouncedSearchTerm },
  });

  return (
    <>
      <Header />
      <hr />
      <main>
        <h1>Reports</h1>
        <label htmlFor="search">Search for a tag or event</label>
        <input
          type="text"
          id="search"
          name="search"
          className="border w-full border-solid rounded border-gray-700 p-1"
          onChange={(event) => setInputValue(event.target.value)}
        />
        <ul>
          {data?.tags?.length > 0 &&
            data?.tags.map((tag) => (
              <li key={tag.uiid}>
                <button
                  type="button"
                  className="border border-solid border-black px-2 py-1"
                >
                  {tag.name}
                </button>
              </li>
            ))}

          {data?.events?.length > 0 &&
            data?.events.map((event) => (
              <li key={event.key}>
                <button
                  type="button"
                  className="border border-solid border-black px-2 py-1"
                >
                  <span className="flex gap-1">
                    {event.tags.map((tag) => (
                      <span key={tag.uiid} className="bg-gray-200">
                        {tag.name}
                      </span>
                    ))}
                  </span>
                  <span className="sr-only">
                    Number of occurrences for this group of tags:
                  </span>
                  <span>{event.amount}</span>
                </button>
              </li>
            ))}
        </ul>
      </main>
      <hr />
      <Footer />
    </>
  );
}
