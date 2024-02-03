/* eslint-disable import/prefer-default-export */
import express from 'express';
import knex from 'knex';
import * as jose from 'jose';
import knexConfig from '../db/knexfile';
import { PEOPLE_TABLE_NAME } from '../db/constants/people.constants';
import { createErrorResponse } from '../utils/build-error-response';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

export const router = express.Router();

router.use(async (request, response, next) => {
  const getErrorObject = createErrorResponse(request, response);

  const { authorization } = request.headers;

  if (!authorization) {
    return getErrorObject({
      status: 401,
      title: 'Unauthorized.',
      detail: 'You are not authorized to perform this action.',
    });
  }

  if (!authorization.startsWith('Bearer ')) {
    return getErrorObject({
      status: 401,
      title: 'JWT problem!',
      detail: 'Missing Bearer prefix.',
    });
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const jwt = authorization.substring(7, authorization.length);

  let payload;
  try {
    ({ payload } = await jose.jwtVerify(jwt, secret));
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      return getErrorObject({
        status: 401,
        title: 'JWT problem!',
        detail: 'Access token expired.',
      });
    }

    if (error instanceof jose.errors.JWSInvalid) {
      return getErrorObject({
        status: 401,
        title: 'JWT problem!',
        detail: 'Invalid access token.',
      });
    }

    return getErrorObject({
      status: 401,
      title: 'JWT problem!',
      detail: 'You are not authorized to perform this action.',
    });
  }

  const selectResult = await sql(PEOPLE_TABLE_NAME)
    .select('id')
    .where({ uiid: payload.uiid });

  if (selectResult.length !== 1) {
    return getErrorObject({
      status: 401,
      title: 'Unauthorized.',
      detail: 'You are not authorized to perform this action.',
    });
  }

  // ? add something more here? Another validation?

  return next();
});
