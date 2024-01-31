/* eslint-disable import/no-extraneous-dependencies */
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

router.post('/', async (request, response) => {
  const getErrorObject = createErrorResponse(request, response);
  const { email } = request.body;

  if (!email) {
    return getErrorObject({
      status: 400,
      title: 'Email is required.',
      detail: 'You can not login without an email.',
    });
  }

  const sanitizedEmail = email.trim().toLocaleLowerCase();

  try {
    const temporaryRefreshToken = '18473yrghfbv';

    const results = await sql(PEOPLE_TABLE_NAME)
      .select('name', 'uiid')
      .where({ email: sanitizedEmail });

    if (results.length === 0) {
      // TODO refactor this to send a friendly error message
      return getErrorObject({
        status: 422,
        title: 'Credential not found.',
        detail:
          'The email you entered does not match our records. Please try again.',
      });
    }

    if (results.length !== 1) {
      // TODO refactor this to send a friendly error message
      return response
        .status(500)
        .json({ message: 'Something went very wrong.' });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT(results[0])
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('3hours')
      .sign(secret);

    return response.json({
      refreshToken: temporaryRefreshToken,
      accessToken: token,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Oops! Something went wrong. Please try again later.' });
  }
});

// router.post('/refresh-token', authorizationMiddleware, (req, res) => {
//   // Assuming the refresh token is in the request body
//   const { refreshToken } = req.body;

//   // Verify the refresh token
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(401);

//     // If the refresh token is valid, create a new access token
//     const accessToken = jwt.sign(
//       { username: user.username },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: '1h' }
//     );

//     return res.json({ accessToken });
//   });
// });

export default router;
