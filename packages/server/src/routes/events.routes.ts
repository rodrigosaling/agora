import express from 'express';
import { nanoid } from 'nanoid';
import { EVENTS_TABLE_NAME } from '../db/constants/events.constants';
import { EVENTS_TAGS_TABLE_NAME } from '../db/constants/event-tags.constants';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sql } from '../db/sql';
import { createErrorResponse } from '../utils/build-error-response';

export const router = express.Router();

export const EVENTS_BASE_URL = '/events';

// function sanitizeOrderBy(columnName: string | undefined): string {
//   const DEFAULT_VALUE = 'date';
//   const ALLOWED_VALUES = [DEFAULT_VALUE, 'mostUsed'];

//   const sanitizedColumnName = columnName?.trim().toLowerCase();

//   if (!ALLOWED_VALUES.includes(sanitizedColumnName)) {
//     return DEFAULT_VALUE;
//   }

//   return sanitizedColumnName;
// }

router.get('/', async (req, res) => {
  const sendError = createErrorResponse(req, res);

  // const isDeleted = Boolean(req.query?.deleted);
  // const sanitizedOrderBy = sanitizeOrderBy(req.query?.orderBy as string);

  try {
    const response = await sql
      .select(
        `${EVENTS_TABLE_NAME}.uiid`,
        `${EVENTS_TABLE_NAME}.date`,
        `${EVENTS_TABLE_NAME}.isDeleted`,
        `${EVENTS_TAGS_TABLE_NAME}.order`,
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
      .orderBy(`${EVENTS_TABLE_NAME}.date`, 'DESC');

    const events = response.reduce((accumulator, currentValue) => {
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

    res.json(events);
  } catch (error) {
    sendError({
      status: 500,
      title: 'Oops! Something went wrong. Please try again later.',
      detail: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  const sendError = createErrorResponse(req, res);
  const tags = req.body;

  try {
    const eventUiid = nanoid(11);
    const now = new Date().toISOString();

    const tagsUiids = tags.map((tag) => tag.uiid);

    const tagsIds = await sql('tags')
      .select('id', 'uiid')
      .whereIn('uiid', tagsUiids);

    const sortedTagsIds = tagsUiids.map((uiid) => {
      const tag = tagsIds.find((t) => t.uiid === uiid);
      return tag ? tag.id : null;
    });

    sql.transaction(async (transaction) => {
      const eventInsertResponse = await transaction(EVENTS_TABLE_NAME).insert(
        {
          date: now,
          uiid: eventUiid,
          ownerId: 1, // FIXME: get user id from somewhere
        },
        ['id'],
      );

      await transaction(EVENTS_TAGS_TABLE_NAME).insert(
        tags.map(({ uiid: tagUiid, order }) => {
          const tagId = tagsIds.find((tag) => tag.uiid === tagUiid).id;
          return {
            eventId: eventInsertResponse[0].id,
            tagId,
            order,
            tagGroup: sortedTagsIds.join(';'),
          };
        }),
      );

      res.json({ uiid: eventUiid });
    });
  } catch (error) {
    sendError({
      status: 500,
      title: 'Oops! Something went wrong. Please try again later.',
      detail: error.message,
    });
  }
});

// router.put('/:uiid', async (req, res) => {
//   const { uiid } = req.params;
//   const { name } = req.body;

//   try {
//     await sql(EVENTS_TABLE_NAME)
//       .where({
//         uiid,
//       })
//       .update({ name });

//     res.json({ uiid, name });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });

// router.put('/:uiid/delete', async (req, res) => {
//   const { uiid } = req.params;

//   try {
//     await sql(EVENTS_TABLE_NAME)
//       .where({
//         uiid,
//       })
//       .update({ isDeleted: true });

//     res.json({ uiid });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });

// router.put('/:uiid/restore', async (req, res) => {
//   const { uiid } = req.params;

//   try {
//     await sql(EVENTS_TABLE_NAME)
//       .where({
//         uiid,
//       })
//       .update({ isDeleted: false });

//     res.json({ uiid });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });

// router.delete('/:uiid', async (req, res) => {
//   const { uiid } = req.params;

//   try {
//     await sql(EVENTS_TABLE_NAME).where({ uiid }).delete();
//     res.json({ uiid });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });
