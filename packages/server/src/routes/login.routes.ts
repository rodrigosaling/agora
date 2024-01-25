/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import knex from 'knex';
import * as jose from 'jose';
import knexConfig from '../db/knexfile';
import { PEOPLE_TABLE_NAME } from '../db/constants/people.constants';
import { router as authorizationMiddleware } from '../middlewares/authorization-middleware';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

export const router = express.Router();

export const LOGIN_BASE_URL = '/login';

router.post('/', async (req, res) => {
  const { email } = req.body;
  const sanitizedEmail = email.trim().toLocaleLowerCase();

  try {
    const temporaryRefreshtoken = '18473yrghfbv';

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

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT(results[0])
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('3hours')
      .sign(secret);

    return res.json({
      refreshToken: temporaryRefreshtoken,
      accessToken: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Oops! Something went wrong. Please try again later.' });
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
