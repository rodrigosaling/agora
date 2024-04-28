/* eslint-disable import/no-extraneous-dependencies */
import crypto from 'crypto';
import express from 'express';
import knex from 'knex';
import * as jose from 'jose';
import knexConfig from '../db/knexfile';
import { PEOPLE_TABLE_NAME } from '../db/constants/people.constants';
import { createErrorResponse } from '../utils/build-error-response';
// import { router as authorizationMiddleware } from '../middlewares/authorization-middleware';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

export const router = express.Router();

export const LOGIN_BASE_URL = '/login';

const ACCESS_TOKEN_EXPIRATION = '2weeks';

type generateAccessTokenProps = {
  email: string;
  uiid: string;
};

async function generateAccessToken(
  payload: generateAccessTokenProps,
): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const accessToken = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
    .sign(secret);
  return accessToken;
}

function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

router.post('/', async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.locals.sendError({
      status: 400,
      title: 'Email is required.',
      detail: 'You can not login without an email.',
    });
  }

  const sanitizedEmail = email.trim().toLocaleLowerCase();

  try {
    const selectResult = await sql(PEOPLE_TABLE_NAME)
      .select('id', 'uiid')
      .where({ email: sanitizedEmail });

    if (selectResult.length === 0) {
      // TODO refactor this to send a friendly error message
      return response.locals.sendError({
        status: 422,
        title: 'Credential not found.',
        detail:
          'The email you entered does not match our records. Please try again.',
      });
    }

    if (selectResult.length !== 1) {
      // TODO refactor this to send a friendly error message
      return response.locals.sendError({
        status: 500,
        title: 'Something went very wrong. 1',
        detail: 'Please try again later.',
      });
    }

    const person = selectResult[0];

    const refreshToken = generateRefreshToken();
    // const passcode = 123456; // TODO create a passcode and sabe it in the database
    const updateResult = await sql(PEOPLE_TABLE_NAME)
      .update({
        refreshToken,
        // passcode,
      })
      .where({
        id: person.id,
      });

    if (!updateResult) {
      return response.locals.sendError({
        status: 500,
        title: 'Something went very wrong. 2',
        detail: 'Please try again later.',
      });
    }

    const accessToken = await generateAccessToken({
      uiid: person.uiid,
      email: sanitizedEmail,
    });

    return response.json({
      refreshToken,
      accessToken,
      email: sanitizedEmail,
    });
  } catch (error) {
    // TODO handle database table non-existence error
    return response.locals.sendError({
      status: 500,
      title: 'Something went very wrong. 3',
      detail: error.message,
    });
  }
});

router.post('/refresh-token', async (request, response) => {
  const { refreshToken, email } = request.body;

  try {
    const results = await sql(PEOPLE_TABLE_NAME)
      .select('id', 'uiid', 'email')
      .where({
        email,
        refreshToken,
      });

    if (results.length !== 1) {
      return response.locals.sendError({
        status: 401,
        title: 'Unauthorized.',
        detail: 'You are not authorized to perform this action.',
      });
    }

    const person = results[0];

    const accessToken = await generateAccessToken({
      email: person.email,
      uiid: person.uiid,
    });

    const newRefreshToken = generateRefreshToken();

    const updateResult = await sql(PEOPLE_TABLE_NAME)
      .update({
        refreshToken: newRefreshToken,
      })
      .where({
        id: person.id,
      });

    if (!updateResult) {
      return response.locals.sendError({
        status: 500,
        title: 'Something went very wrong.',
        detail: 'Please try again later.',
      });
    }

    return response.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return response.locals.sendError({
      status: 500,
      title: 'Something went wrong.',
      detail: 'Please try again later.',
    });
  }
});

export default router;
