import express from 'express';
import { nanoid } from 'nanoid';
import { EVENTS_TABLE_NAME } from '../db/constants/events.constants';
import { EVENTS_TAGS_TABLE_NAME } from '../db/constants/event-tags.constants';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sql } from '../db/sql';
import { getBaseSelectEventsQuery } from '../services/get-base-select-events-query';

export const router = express.Router();

export const EVENTS_BASE_URL = '/events';

router.get('/', async (req, res) => {
  // const orderBy = req.query?.orderBy as string;

  let isDeleted = null;
  if (req.query?.deleted === '1') {
    isDeleted = true;
  } else if (req.query?.deleted === '0') {
    isDeleted = false;
  }

  try {
    const selectEventsQuery = getBaseSelectEventsQuery().modify((q) => {
      if (isDeleted !== null) {
        q.where(`${EVENTS_TABLE_NAME}.isDeleted`, isDeleted);
      }
    });

    const response = await selectEventsQuery;

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
    res.locals.sendError({
      status: 500,
      title: 'Oops! Something went wrong. Please try again later.',
      detail: error.message,
    });
  }
});

router.post('/', async (req, res) => {
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
    res.locals.sendError({
      status: 500,
      title: 'Oops! Something went wrong. Please try again later.',
      detail: error.message,
    });
  }
});

router.get('/:uiid', async (req, res) => {
  const { uiid } = req.params;

  try {
    const selectEventsQuery = getBaseSelectEventsQuery().modify((q) => {
      q.where(`${EVENTS_TABLE_NAME}.uiid`, '=', uiid);
    });

    const response = await selectEventsQuery;

    const event = response.reduce((accumulator, currentValue, currentIndex) => {
      if (currentIndex > 0) {
        accumulator.tags.push({
          uiid: currentValue.tagUiid,
          name: currentValue.tagName,
          order: currentValue.order,
        });
        return accumulator;
      }

      accumulator.uiid = currentValue.uiid;
      accumulator.date = currentValue.date;
      accumulator.isDeleted = currentValue.isDeleted;
      accumulator.tags = [
        {
          uiid: currentValue.tagUiid,
          name: currentValue.tagName,
          order: currentValue.order,
        },
      ];

      return accumulator;
    }, {});

    res.json(event);
  } catch (error) {
    res.locals.sendError({
      status: 500,
      title: 'Error loading a specific event.',
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
