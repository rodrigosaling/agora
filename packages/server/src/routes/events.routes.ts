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
  const { tagsHashes } = req.body;
  try {
    const hash = nanoid(11);
    const now = new Date().toISOString();

    const tagIds = await sql('tags').select('id').whereIn('uiid', tagsHashes);

    const eventId = await sql(EVENTS_TABLE_NAME).insert(
      {
        date: now,
        hash,
      },
      ['id']
    );

    await sql('events_tags').insert(
      tagIds.map((tagId: string) => ({
        eventId,
        tagId,
      }))
    );

    return res.json({ hash });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * PUT /events/:hash
 *
 * Updates the name of an event in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated event as a JSON response.
 */
// router.put('/:hash', async (req, res) => {
//   const { hash } = req.params;
//   const { name } = req.body;

//   try {
//     await sql(EVENTS_TABLE_NAME)
//       .where({
//         hash,
//       })
//       .update({ name });

//     res.json({ hash, name });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });

/**
 * PUT /events/:hash/delete
 *
 * Logically deletes an event in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted event as a JSON response.
 */
// router.put('/:hash/delete', async (req, res) => {
//   const { hash } = req.params;

//   try {
//     await sql(EVENTS_TABLE_NAME)
//       .where({
//         hash,
//       })
//       .update({ isDeleted: true });

//     res.json({ hash });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });

/**
 * PUT /events/:hash/restore
 *
 * Restores a logically deleted event in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The restored event as a JSON response.
 */
// router.put('/:hash/restore', async (req, res) => {
//   const { hash } = req.params;

//   try {
//     await sql(EVENTS_TABLE_NAME)
//       .where({
//         hash,
//       })
//       .update({ isDeleted: false });

//     res.json({ hash });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });

/**
 * DELETE /events/:hash
 *
 * Physically deletes an event from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted event as a JSON response.
 */
// router.delete('/:hash', async (req, res) => {
//   const { hash } = req.params;

//   try {
//     await sql(EVENTS_TABLE_NAME).where({ hash }).delete();
//     res.json({ hash });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Oops! Something went wrong. Please try again later.' });
//   }
// });
