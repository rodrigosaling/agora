import { useRef, useState } from 'react';
import { Tag } from '../types/tag';
import { useGetTags } from '../hooks/use-get-tags';
import { useGetEvents } from '../hooks/use-get-events';
import { useEvents } from '../hooks/use-events';
import { DefaultTemplate } from '../templates/default';
import { dateTimeFormat } from '../utils/date-time-format.utils';

type handleSelectedTagsProps = {
  tagUiid: string;
  isTagSelected: boolean;
};

export default function Home() {
  const { data: tagsData } = useGetTags();
  const { data: eventsData } = useGetEvents({
    searchParams: { orderBy: 'date' },
  });
  const { createEvent } = useEvents();

  const [selectedTags, setSelectedTags] = useState([] as string[]);
  const dialogRef = useRef(null);

  const setsOfTags = eventsData?.reduce((accumulator, currentValue) => {
    const tagsUiids = currentValue.tags.map((tag) => tag.uiid).join('');
    if (!accumulator[tagsUiids]) {
      accumulator[tagsUiids] = {
        key: tagsUiids,
        amount: 0,
        tags: currentValue.tags,
      };
    }
    accumulator[tagsUiids].amount += 1;
    return accumulator;
  }, {});

  const mostUsedTags = setsOfTags
    ? Object.values(setsOfTags).sort((a, b) => b.amount - a.amount)
    : [];

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

  function handleTagsGroupsButtonClick(tags) {
    createEvent.mutate(tags);
  }

  function handleCreateEventButtonClick() {
    createEvent.mutate(
      selectedTags.map((uiid, index) => ({ uiid, order: index })),
    );
  }

  function handleAddNewTagButtonClick() {
    dialogRef.current.showModal();
  }

  return (
    <DefaultTemplate>
      <p>
        You are seeing the events related to the group <strong>Work</strong>.
      </p>

      <h2>Most used group of tags to create an event</h2>
      <p>
        When you click/touch an event on this list, it will create the same
        event with the current date and time.
      </p>
      <ul className="list-none p-0 flex gap-2 flex-wrap">
        {mostUsedTags.length > 0 &&
          mostUsedTags.map((event) => (
            <li key={event.key}>
              <button
                type="button"
                onClick={() => handleTagsGroupsButtonClick(event.tags)}
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

      <h2>Most used tags</h2>
      <p>Click/touch any of these tags to start creating a new event.</p>
      <ul className="list-none p-0 flex gap-2 flex-wrap">
        <li>
          <button
            type="button"
            onClick={handleAddNewTagButtonClick}
            className="bg-lime-100"
          >
            + Add new tag +
          </button>
        </li>
        {tagsData &&
          tagsData.map((tag: Tag) => {
            const isTagSelected = selectedTags.includes(tag.uiid);

            return (
              <li key={tag.uiid}>
                <button
                  type="button"
                  className="border border-solid border-black px-2 py-1"
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
                (originalTag: Tag) => originalTag.uiid === tagUiid,
              );
              return <li key={tag.uiid}>{tag.name}</li>;
            })}
          </ul>
          <button
            type="button"
            onClick={handleCreateEventButtonClick}
            className="border border-solid border-black px-2 py-1"
          >
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

      <dialog
        ref={dialogRef}
        className="border border-solid border-black p-2 rounded backdrop:bg-gray-500/50"
      >
        <p>This modal dialog has a groovy backdrop!</p>
        <button type="button" onClick={() => dialogRef.current.close()}>
          Close
        </button>
      </dialog>
    </DefaultTemplate>
  );
}
