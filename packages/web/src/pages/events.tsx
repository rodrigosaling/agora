import { Link } from 'react-router-dom';
import { useGetEvents } from '../hooks/use-get-events';
import { DefaultTemplate } from '../templates/default';
import { dateTimeFormat } from '../utils/date-time-format.utils';

export default function Events() {
  const { data: eventsData } = useGetEvents();
  return (
    <DefaultTemplate>
      <h1>Events</h1>
      <p>
        Clique no evento para ver seus detalhes ou clique na lixeira para
        deletar ele.
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
                <p className="m-0">
                  <Link to={`/events/${event.uiid}`}>
                    {dateTimeFormat.format(eventDate)}
                  </Link>
                </p>
                <ul className="list-none p-0 flex gap-2">
                  {event.tags.map((tag) => (
                    <li key={tag.uiid}>{tag.name}</li>
                  ))}
                </ul>
              </li>
            );
          })}
      </ul>
    </DefaultTemplate>
  );
}
