/**
 * This file contains the routes for handling tags in the server.
 */

import express from 'express';
import { nanoid } from 'nanoid';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sql } from '../db/sql';

export const router = express.Router();

export const TAGS_BASE_URL = '/tags';

/**
 * GET /tags
 *
 * Retrieves tags from the database based on the 'deleted' query parameter.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The retrieved tags as a JSON response.
 */
router.get('/', async (req, res) => {
  const { deleted } = req.query;

  try {
    const response = await sql(TAGS_TABLE_NAME)
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
 * POST /tags
 *
 * Creates a new tag in the database. Checks if the tag already exists and returns the existing tag if found.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The created tag as a JSON response.
 */
router.post('/', async (req, res) => {
  const { name } = req.body;
  const sanitizedName = name.trim().toLocaleLowerCase();
  try {
    // TODO check the onConflict or UPSERT syntax for knex
    const results = await sql(TAGS_TABLE_NAME)
      .select('name', 'uiid')
      .where({ name: sanitizedName });

    if (results.length > 0) {
      // TODO refactor this to send a friendly error message
      return res.status(409).json(results[0]);
    }

    const hash = nanoid(11);

    await sql(TAGS_TABLE_NAME).insert({
      name,
      hash,
    });

    return res.json({ hash, name });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * PUT /tags/:hash
 *
 * Updates the name of a tag in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated tag as a JSON response.
 */
router.put('/:hash', async (req, res) => {
  const { hash } = req.params;
  const { name } = req.body;

  try {
    await sql(TAGS_TABLE_NAME)
      .where({
        hash,
      })
      .update({ name });

    res.json({ hash, name });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * PUT /tags/:hash/delete
 *
 * Logically deletes a tag in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted tag as a JSON response.
 */
router.put('/:hash/delete', async (req, res) => {
  const { hash } = req.params;

  try {
    await sql(TAGS_TABLE_NAME)
      .where({
        hash,
      })
      .update({ isDeleted: true });

    res.json({ hash });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * PUT /tags/:hash/restore
 *
 * Restores a logically deleted tag in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The restored tag as a JSON response.
 */
router.put('/:hash/restore', async (req, res) => {
  const { hash } = req.params;

  try {
    await sql(TAGS_TABLE_NAME)
      .where({
        hash,
      })
      .update({ isDeleted: false });

    res.json({ hash });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * DELETE /tags/:hash
 *
 * Physically deletes a tag from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted tag as a JSON response.
 */
router.delete('/:hash', async (req, res) => {
  const { hash } = req.params;

  try {
    await sql(TAGS_TABLE_NAME).where({ hash }).delete();
    res.json({ hash });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});
