/**
 * This file contains the routes for handling events in the server.
 */

import express from 'express';
import { nanoid } from 'nanoid';
import { EVENTS_TABLE_NAME } from '../db/constants/events.constants';
import { EVENT_TAGS_TABLE_NAME } from '../db/constants/event-tags.constants';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sql } from '../db/sql';
import { createErrorResponse } from '../utils/build-error-response';

export const router = express.Router();

export const EVENTS_BASE_URL = '/events';

/**
 * GET /events
 *
 * Retrieves events from the database based on the 'deleted' query parameter.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The retrieved events as a JSON response.
 */
router.get('/', async (req, res) => {
  const sendError = createErrorResponse(req, res);

  // const isDeleted = Boolean(req.query?.deleted);
  // const sanitizedColumnName = sanitizeColumnName(req.query?.orderBy as string);

  try {
    const response = await sql
      .select(
        `${EVENTS_TABLE_NAME}.uiid`,
        `${EVENTS_TABLE_NAME}.date`,
        `${EVENTS_TABLE_NAME}.isDeleted`,
        `${EVENT_TAGS_TABLE_NAME}.order`,
        `${TAGS_TABLE_NAME}.uiid AS tagUiid`,
        `${TAGS_TABLE_NAME}.name AS tagName`
      )
      .from(EVENTS_TABLE_NAME)
      .join(
        EVENT_TAGS_TABLE_NAME,
        `${EVENTS_TABLE_NAME}.id`,
        '=',
        `${EVENT_TAGS_TABLE_NAME}.eventId`
      )
      .join(
        TAGS_TABLE_NAME,
        `${EVENT_TAGS_TABLE_NAME}.tagId`,
        '=',
        `${TAGS_TABLE_NAME}.id`
      )
      // TODO change this to order by the number of times the same group of tags is used
      .orderBy(`${EVENTS_TABLE_NAME}.date`);

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

/**
 * POST /events
 *
 * Creates a new event in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The created event as a JSON response.
 */
router.post('/', async (req, res) => {
  const { tagsUiids } = req.body;
  try {
    const eventUiid = nanoid(11);
    const now = new Date().toISOString();

    const tagIds = await sql('tags').select('id').whereIn('uiid', tagsUiids);

    const eventId = await sql(EVENTS_TABLE_NAME).insert(
      {
        date: now,
        uiid: eventUiid,
      },
      ['id']
    );

    await sql('events_tags').insert(
      tagIds.map((tagId: string) => ({
        eventId,
        tagId,
      }))
    );

    return res.json({ uiid: eventUiid });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * PUT /events/:uiid
 *
 * Updates the name of an event in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated event as a JSON response.
 */
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

/**
 * PUT /events/:uiid/delete
 *
 * Logically deletes an event in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted event as a JSON response.
 */
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

/**
 * PUT /events/:uiid/restore
 *
 * Restores a logically deleted event in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The restored event as a JSON response.
 */
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

/**
 * DELETE /events/:uiid
 *
 * Physically deletes an event from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted event as a JSON response.
 */
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
