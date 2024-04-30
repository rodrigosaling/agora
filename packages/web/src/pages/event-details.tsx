import { Link, useParams } from 'react-router-dom';
import { useGetEvents } from '../hooks/use-get-events';
import { DefaultTemplate } from '../templates/default';
import { dateTimeFormat } from '../utils/date-time-format.utils';
import { useGetEvent } from '../hooks/use-get-event';

export default function EventDetails() {
  const { uiid } = useParams();
  const { data: eventData, isLoading } = useGetEvent(uiid);

  if (isLoading) {
    return (
      <DefaultTemplate>
        <h1>Loading...</h1>
      </DefaultTemplate>
    );
  }

  const eventDate = new Date(eventData.date);

  return (
    <DefaultTemplate>
      <h1>Event on {dateTimeFormat.format(eventDate)}</h1>
      <ul>
        {eventData.tags.map((tag) => (
          <li key={tag.uiid}>{tag.name}</li>
        ))}
      </ul>
    </DefaultTemplate>
  );
}
