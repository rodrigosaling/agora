/**
 * This file contains the routes for handling events in the server.
 */

import express from 'express';
import { nanoid } from 'nanoid';
import { EVENTS_TABLE_NAME } from '../db/constants/events.constants';
import { sql } from '../db/sql';

export const router = express.Router();

export const TAGS_BASE_URL = '/events';

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
  const { deleted } = req.query;

  try {
    const response = await sql(EVENTS_TABLE_NAME)
      .select('name', 'uiid')
      .where({ isDeleted: deleted === 'true' });

    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
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
  const { tagsUIIDs } = req.body;
  try {
    const uiid = nanoid(11);
    const now = new Date().toISOString();

    const tagIds = await sql('tags').select('id').whereIn('uiid', tagsUIIDs);

    const eventId = await sql(EVENTS_TABLE_NAME).insert(
      {
        date: now,
        uiid,
      },
      ['id']
    );

    await sql('events_tags').insert(
      tagIds.map((tagId: string) => ({
        eventId,
        tagId,
      }))
    );

    return res.json({ uiid });
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
