import express from 'express';
import knex from 'knex';
import { nanoid } from 'nanoid';
import knexConfig from './db/knexfile';
import { TAGS_TABLE_NAME } from './db/constants/tags.constants';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

export const router = express.Router();

export const TAGS_BASE_URL = '/tags';

router.use(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if the hash exists in the people table
  const person = await sql('people')
    .select('hash')
    .where({ hash: authorization })
    .first();

  if (!person) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
});

router.get('/', async (req, res) => {
  const { deleted } = req.query;

  try {
    const response = await sql(TAGS_TABLE_NAME)
      .select('name', 'hash')
      .where({ isDeleted: deleted === 'true' });

    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});

/** Creates a new tag in the database. First the code checks for the same tag
 * already existing in the database. If it does, it returns the existing tag.
 */
router.post('/', async (req, res) => {
  const { name } = req.body;
  const sanitizedName = name.trim().toLocaleLowerCase();
  try {
    // TODO check the onConflict or UPSERT syntax for knex
    const results = await sql(TAGS_TABLE_NAME)
      .select('name', 'hash')
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
 * Logical delete of a tag. This allows us to keep the tag in the database
 * but not show it to the user, and also rollback the delete if needed.
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
 * Restore a tag that was previously logically deleted. This will make the
 * tag visible again.
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
 * Physical delete of a tag. This will remove the tag from the database
 * permanently.
 */
router.delete('/:hash', async (req, res) => {
  const { hash } = req.params;

  try {
    await sql(TAGS_TABLE_NAME).where({ hash }).del();
    res.json({ hash });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});
