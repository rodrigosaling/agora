import express from 'express';
import knex from 'knex';
import knexConfig from '../db/knexfile';
import { PEOPLE_TABLE_NAME } from '../db/constants/people.constants';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

export const router = express.Router();

export const LOGIN_BASE_URL = '/login';

router.post('/', async (req, res) => {
  const { email } = req.body;
  const sanitizedEmail = email.trim().toLocaleLowerCase();
  try {
    const results = await sql(PEOPLE_TABLE_NAME)
      .select('name', 'hash')
      .where({ email: sanitizedEmail });

    if (results.length === 0) {
      // TODO refactor this to send a friendly error message
      return res.status(404).json('User not found');
    }

    if (results.length !== 1) {
      // TODO refactor this to send a friendly error message
      return res.status(500).json('Something went very wrong.');
    }

    return res.json(results[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
  }
});
