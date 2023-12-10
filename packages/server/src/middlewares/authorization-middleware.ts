/* eslint-disable import/prefer-default-export */
import express from 'express';
import knex from 'knex';
import knexConfig from '../db/knexfile';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

export const router = express.Router();

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
