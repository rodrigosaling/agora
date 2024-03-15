import Header from '../components/header';
import { Footer } from '../components/footer';
import { Tag } from '../types/tag';
import { useGetTags } from '../hooks/use-get-tags';

export default function Home() {
  const { data } = useGetTags();

  return (
    <>
      <Header />
      <hr />
      <main>
        <p>
          You are seeing the events related to the group <strong>Work</strong>.
        </p>

        <h2>Most used events</h2>
        <p>
          When you click/touch an event on this list, it will create the same
          event with the current date and time.
        </p>

        <h2>Most used tags</h2>
        <p>Click/touch any of these tags to start creating a new event.</p>
        <ul className="list-none p-0 flex gap-2">
          {data &&
            data.map((tag: Tag) => (
              <li key={tag.uiid}>
                <button type="button">{tag.name}</button>
              </li>
            ))}
        </ul>

        <h2>Last logged events</h2>
        <p>
          Clicking a tag will filter all events that have that tag. Clicking on
          the event will open its details.
        </p>
      </main>
      <hr />
      <Footer />
    </>
  );
}
