import { useState } from 'react';
import Header from '../components/header';
import { Footer } from '../components/footer';
import { Tag } from '../types/tag';
import { useGetTags } from '../hooks/use-get-tags';
import { useGetEvents } from '../hooks/use-get-events';

type handleSelectedTagsProps = {
  tagUiid: string;
  isTagSelected: boolean;
};

export default function Home() {
  const { data: tagsData } = useGetTags();
  const { data: eventsData } = useGetEvents({
    searchParams: { orderBy: 'mostUsed' },
  });
  const { data: lastEventsData } = useGetEvents({
    searchParams: { orderBy: 'date' },
  });

  const [selectedTags, setSelectedTags] = useState([] as string[]);

  function handleMostUsedTagsButtonClick({
    tagUiid,
    isTagSelected,
  }: handleSelectedTagsProps) {
    if (!isTagSelected) {
      setSelectedTags([...selectedTags, tagUiid]);
    } else {
      setSelectedTags([...selectedTags.filter((item) => item !== tagUiid)]);
    }
  }

  function handleCreateEventButtonClick() {
    // add
  }

  const dateTimeFormat = new Intl.DateTimeFormat('pt-br', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  });

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
        <ul className="list-none p-0 flex gap-2 flex-wrap">
          {eventsData &&
            eventsData.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <li
                  key={event.uiid}
                  className="border border-solid border-black p-2"
                >
                  <p className="m-0">{dateTimeFormat.format(eventDate)}</p>
                  <ul className="list-none p-0 flex gap-2">
                    {event.tags.map((tag) => (
                      <li key={tag.uiid}>{tag.name}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
        </ul>

        <h2>Most used tags</h2>
        <p>Click/touch any of these tags to start creating a new event.</p>
        <ul className="list-none p-0 flex gap-2">
          {tagsData &&
            tagsData.map((tag: Tag) => {
              const isTagSelected = selectedTags.includes(tag.uiid);

              return (
                <li key={tag.uiid}>
                  <button
                    type="button"
                    style={isTagSelected ? { backgroundColor: '#88b2ea' } : {}}
                    onClick={() =>
                      handleMostUsedTagsButtonClick({
                        tagUiid: tag.uiid,
                        isTagSelected,
                      })
                    }
                  >
                    {tag.name}
                  </button>
                </li>
              );
            })}
        </ul>

        {selectedTags.length > 0 && (
          <>
            <p>New event as: </p>
            <ul className="list-none p-0 flex gap-2">
              {selectedTags.map((tagUiid) => {
                const tag = tagsData.find(
                  (originalTag: Tag) => originalTag.uiid === tagUiid
                );
                return <li key={tag.uiid}>{tag.name}</li>;
              })}
            </ul>
            <button type="button" onClick={handleCreateEventButtonClick}>
              create event
            </button>
          </>
        )}

        <h2>Last logged events</h2>
        <p>
          Clicking a tag will filter all events that have that tag. Clicking on
          the event will open its details.
        </p>
        <ul className="list-none p-0 flex gap-2 flex-wrap">
          {lastEventsData &&
            lastEventsData.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <li
                  key={event.uiid}
                  className="border border-solid border-black p-2"
                >
                  <p className="m-0">{dateTimeFormat.format(eventDate)}</p>
                  <ul className="list-none p-0 flex gap-2">
                    {event.tags.map((tag) => (
                      <li key={tag.uiid}>{tag.name}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
        </ul>
      </main>
      <hr />
      <Footer />
    </>
  );
}
