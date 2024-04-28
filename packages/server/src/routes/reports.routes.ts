import express from 'express';
import { EVENTS_TABLE_NAME } from '../db/constants/events.constants';
import { EVENTS_TAGS_TABLE_NAME } from '../db/constants/event-tags.constants';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sql } from '../db/sql';
import { getBaseSelectEventsQuery } from '../services/get-base-select-events-query';

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
  const query = req.query?.q;
  const sanitizedQuery = query?.toString().trim();

  try {
    const tagsResult = await sql
      .select('id', 'name', 'uiid', 'isDeleted')
      .from(TAGS_TABLE_NAME)
      .where(
        sql.raw(`LOWER(name) LIKE ?`, [`%${sanitizedQuery.toLowerCase()}%`]),
      )
      .andWhere('isDeleted', false);

    const tagsIds = [];
    const tags = [];

    tagsResult.forEach((tag) => {
      tagsIds.push(tag.id);
      tags.push({
        name: tag.name,
        uiid: tag.uiid,
        isDeleted: tag.isDeleted,
      });
    });

    const eventsTagsResult = await sql
      .distinct(`${EVENTS_TAGS_TABLE_NAME}.tagGroup`)
      .from(EVENTS_TAGS_TABLE_NAME)
      .whereIn(`${EVENTS_TAGS_TABLE_NAME}.tagId`, tagsIds);

    const tagsGroups = eventsTagsResult.map((eventTag) => eventTag.tagGroup);

    const selectEventsQuery = getBaseSelectEventsQuery().modify((q) => {
      q.where(`${EVENTS_TABLE_NAME}.isDeleted`, false).whereIn(
        `${EVENTS_TAGS_TABLE_NAME}.tagGroup`,
        tagsGroups,
      );
    });

    const eventsResult = await selectEventsQuery;

    const restructuredEvents = eventsResult.reduce(
      (accumulator, currentValue) => {
        const lastIndex = accumulator.length - 1;
        if (currentValue.uiid === accumulator[lastIndex]?.uiid) {
          accumulator[lastIndex].tags.push({
            name: currentValue.tagName,
            order: currentValue.order,
          });
        } else {
          accumulator.push({
            uiid: currentValue.uiid,
            tagGroup: currentValue.tagGroup,
            tags: [
              {
                name: currentValue.tagName,
                order: currentValue.order,
              },
            ],
          });
        }
        return accumulator;
      },
      [],
    );

    const uniqueEvents = restructuredEvents.reduce(
      (accumulator, currentValue) => {
        if (!accumulator[currentValue.tagGroup]) {
          accumulator[currentValue.tagGroup] = {
            uiid: currentValue.uiid,
            amount: 0,
            tags: currentValue.tags.sort((a, b) => a.order - b.order),
          };
        }
        accumulator[currentValue.tagGroup].amount += 1;
        return accumulator;
      },
      {},
    );

    const sanitizedEvents = Object.values(uniqueEvents);

    res.json({ tags, events: sanitizedEvents });
  } catch (error) {
    res.locals.sendError({
      status: 500,
      title: 'Oops! Something went wrong. Please try again later.',
      detail: error.message,
    });
  }
});
