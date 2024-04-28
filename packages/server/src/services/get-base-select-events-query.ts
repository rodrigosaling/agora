import { sql } from '../db/sql';
import { EVENTS_TABLE_NAME } from '../db/constants/events.constants';
import { EVENTS_TAGS_TABLE_NAME } from '../db/constants/event-tags.constants';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sanitizeColumnName } from '../utils/sanitize-column-name';

// function sanitizeOrderBy(columnName: string | undefined): string {
//   const DEFAULT_KEY = 'date';
//   const ALLOWED_VALUES = {
//     [DEFAULT_KEY]: `${EVENTS_TABLE_NAME}.date`,
//   };

//   return sanitizeColumnName(columnName, DEFAULT_KEY, ALLOWED_VALUES);
// }

export function getBaseSelectEventsQuery() {
  // const sanitizedOrderBy = sanitizeOrderBy(orderBy);

  return sql
    .select(
      `${EVENTS_TABLE_NAME}.id`,
      `${EVENTS_TABLE_NAME}.uiid`,
      `${EVENTS_TABLE_NAME}.date`,
      `${EVENTS_TABLE_NAME}.isDeleted`,
      `${EVENTS_TAGS_TABLE_NAME}.order`,
      `${EVENTS_TAGS_TABLE_NAME}.tagGroup`,
      `${TAGS_TABLE_NAME}.id AS tagId`,
      `${TAGS_TABLE_NAME}.uiid AS tagUiid`,
      `${TAGS_TABLE_NAME}.name AS tagName`,
    )
    .from(EVENTS_TABLE_NAME)
    .join(
      EVENTS_TAGS_TABLE_NAME,
      `${EVENTS_TABLE_NAME}.id`,
      '=',
      `${EVENTS_TAGS_TABLE_NAME}.eventId`,
    )
    .join(
      TAGS_TABLE_NAME,
      `${EVENTS_TAGS_TABLE_NAME}.tagId`,
      '=',
      `${TAGS_TABLE_NAME}.id`,
    )
    .orderBy(`${EVENTS_TABLE_NAME}.date`, 'DESC')
    .orderBy(`${EVENTS_TAGS_TABLE_NAME}.order`, 'ASC');
}
