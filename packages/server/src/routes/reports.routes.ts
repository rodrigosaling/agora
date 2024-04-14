import express from 'express';
import { EVENTS_TABLE_NAME } from '../db/constants/events.constants';
import { EVENTS_TAGS_TABLE_NAME } from '../db/constants/event-tags.constants';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sql } from '../db/sql';
import { createErrorResponse } from '../utils/build-error-response';

export const router = express.Router();

export const REPORTS_BASE_URL = '/reports';

// function sanitizeColumnName(columnName: string | undefined): string {
//   const DEFAULT_COLUMN = 'name';
//   const ALLOWED_COLUMNS = [DEFAULT_COLUMN, 'order'];

//   const sanitizedColumnName = columnName?.trim().toLowerCase();

//   if (!ALLOWED_COLUMNS.includes(sanitizedColumnName)) {
//     return DEFAULT_COLUMN;
//   }

//   return sanitizedColumnName;
// }

router.get('/search', async (req, res) => {
  const sendError = createErrorResponse(req, res);
  const query = req.query?.q;

  try {
    const tagsResult = await sql
      .select('id', 'name', 'uiid', 'isDeleted')
      .from(TAGS_TABLE_NAME)
      .whereLike('name', `%${query}%`)
      .andWhere('isDeleted', false);

    const tagsIds = tagsResult.map((tag) => tag.id);

    const tags = tagsResult.map(({ name, uiid, isDeleted }) => ({
      name,
      uiid,
      isDeleted,
    }));

    const eventsTagsResult = await sql
      .select(`${EVENTS_TAGS_TABLE_NAME}.eventId`)
      .from(EVENTS_TAGS_TABLE_NAME)
      .join(
        EVENTS_TABLE_NAME,
        `${EVENTS_TAGS_TABLE_NAME}.eventId`,
        '=',
        `${EVENTS_TABLE_NAME}.id`,
      )
      .join(
        TAGS_TABLE_NAME,
        `${EVENTS_TAGS_TABLE_NAME}.tagId`,
        '=',
        `${TAGS_TABLE_NAME}.id`,
      )
      .whereIn(`${TAGS_TABLE_NAME}.id`, tagsIds)
      .andWhere(`${EVENTS_TABLE_NAME}.isDeleted`, false)
      .groupBy(`${EVENTS_TAGS_TABLE_NAME}.tagGroup`)
      .orderBy(`${EVENTS_TABLE_NAME}.date`, 'DESC');

    const eventIds = eventsTagsResult.map((event) => event.eventId);

    const eventsResult = await sql
      .select(
        `${EVENTS_TABLE_NAME}.uiid`,
        `${EVENTS_TABLE_NAME}.date`,
        `${EVENTS_TAGS_TABLE_NAME}.order`,
        `${EVENTS_TAGS_TABLE_NAME}.tagGroup`,
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
      .whereIn(`${EVENTS_TABLE_NAME}.id`, eventIds)
      .orderBy(`${EVENTS_TABLE_NAME}.date`, 'DESC')
      .orderBy(`${EVENTS_TAGS_TABLE_NAME}.order`, 'ASC');

    const events = eventsResult.reduce((accumulator, currentValue) => {
      const lastIndex = accumulator.length - 1;
      if (currentValue.uiid === accumulator[lastIndex]?.uiid) {
        accumulator[lastIndex].tags.push({
          uiid: currentValue.tagUiid,
          name: currentValue.tagName,
          order: currentValue.order,
        });
      } else {
        accumulator.push({
          uiid: currentValue.uiid,
          date: currentValue.date,
          isDeleted: currentValue.isDeleted,
          tags: [
            {
              uiid: currentValue.tagUiid,
              name: currentValue.tagName,
              order: currentValue.order,
            },
          ],
        });
      }
      return accumulator;
    }, []);

    res.json({ tags, events });
  } catch (error) {
    sendError({
      status: 500,
      title: 'Oops! Something went wrong. Please try again later.',
      detail: error.message,
    });
  }
});
