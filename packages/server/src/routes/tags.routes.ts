/**
 * This file contains the routes for handling tags in the server.
 */

import express from 'express';
import { nanoid } from 'nanoid';
import { TAGS_TABLE_NAME } from '../db/constants/tags.constants';
import { sql } from '../db/sql';
import { tagNamesSanitizer } from '../utils/tag-names-sanitizer';

export const router = express.Router();

export const TAGS_BASE_URL = '/tags';

function sanitizeColumnName(columnName: string | undefined): string {
  const DEFAULT_COLUMN = 'name';
  const ALLOWED_COLUMNS = [DEFAULT_COLUMN, 'order'];

  const sanitizedColumnName = columnName?.trim().toLowerCase();

  if (!ALLOWED_COLUMNS.includes(sanitizedColumnName)) {
    return DEFAULT_COLUMN;
  }

  return sanitizedColumnName;
}

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
  const isDeleted = Boolean(req.query?.deleted);
  const sanitizedColumnName = sanitizeColumnName(req.query?.orderBy as string);

  try {
    const response = await sql(TAGS_TABLE_NAME)
      .select('name', 'uiid', 'isDeleted')
      .where({ isDeleted })
      .orderBy(sanitizedColumnName);

    res.json(response);
  } catch (error) {
    res.locals.sendError({
      status: 500,
      title: 'Oops! Something went wrong. Please try again later.',
      detail: error.message,
    });
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
  const { names } = req.body;

  if (!names?.trim()) {
    return res.locals.sendError({
      status: 400,
      title: 'Missing data',
    });
  }

  const sanitizedNames = tagNamesSanitizer(names);
  const namesToInsert = sanitizedNames.map((name) => ({
    name,
    uiid: nanoid(11),
  }));

  try {
    const result = await sql(TAGS_TABLE_NAME)
      .insert(namesToInsert, ['name', 'uiid'])
      .onConflict('name')
      .merge(['name']);

    return res.json(result);
  } catch (error) {
    return res.locals.sendError({
      status: 500,
      title: 'Problem inserting tags',
      detail: error.message,
    });
  }
});

/**
 * PUT /tags/:uiid
 *
 * Updates the name of a tag in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated tag as a JSON response.
 */
router.put('/:uiid', async (req, res) => {
  const { uiid } = req.params;
  const { names } = req.body;

  if (!names?.trim()) {
    return res.locals.sendError({
      status: 400,
      title: 'Missing data',
    });
  }

  // const sanitizedNames = tagNamesSanitizer(names);

  try {
    await sql(TAGS_TABLE_NAME)
      .where({
        uiid,
      })
      .update({ names });

    return res.json({ uiid, names });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * PUT /tags/:uiid/delete
 *
 * Logically deletes a tag in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted tag as a JSON response.
 */
router.put('/:uiid/delete', async (req, res) => {
  const { uiid } = req.params;

  try {
    await sql(TAGS_TABLE_NAME)
      .where({
        uiid,
      })
      .update({ isDeleted: true });

    res.json({ uiid });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * PUT /tags/:uiid/restore
 *
 * Restores a logically deleted tag in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The restored tag as a JSON response.
 */
router.put('/:uiid/restore', async (req, res) => {
  const { uiid } = req.params;

  try {
    await sql(TAGS_TABLE_NAME)
      .where({
        uiid,
      })
      .update({ isDeleted: false });

    res.json({ uiid });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/**
 * DELETE /tags/:uiid
 *
 * Physically deletes a tag from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted tag as a JSON response.
 */
router.delete('/:uiid', async (req, res) => {
  const { uiid } = req.params;

  try {
    await sql(TAGS_TABLE_NAME).where({ uiid }).delete();
    res.json({ uiid });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});
