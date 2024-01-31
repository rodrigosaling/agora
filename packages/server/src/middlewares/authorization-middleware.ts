/* eslint-disable import/prefer-default-export */
import express from 'express';
import knex from 'knex';
import * as jose from 'jose';
import knexConfig from '../db/knexfile';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

export const router = express.Router();

router.use(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const jwt = authorization;

  let payload;
  try {
    ({ payload } = await jose.jwtVerify(jwt, secret));
  } catch (error) {
    return res.status(401).json({ error: 'JWT problem!' });
  }

  const person = await sql('people')
    .select('uiid')
    .where({ hash: payload.hash })
    .first();

  if (!person) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
});
