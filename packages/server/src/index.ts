import express from 'express';
import cors from 'cors';
import dotenvx from '@dotenvx/dotenvx';

import { TAGS_BASE_URL, router as tagsRoutes } from './routes/tags.routes';
import { LOGIN_BASE_URL, router as loginRoutes } from './routes/login.routes';
import {
  EVENTS_BASE_URL,
  router as eventsRoutes,
} from './routes/events.routes';
import { router as authorizationMiddleware } from './middlewares/authorization-middleware';
import { router as sendErrorMiddleware } from './middlewares/send-error.middleware';

import { sql } from './db/sql';
import {
  REPORTS_BASE_URL,
  router as reportsRoutes,
} from './routes/reports.routes';

const app = express();
const port = 3000;

dotenvx.config();

app.use(cors());
// app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.json()); // to support JSON-encoded bodies

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use('*', sendErrorMiddleware);
app.use(LOGIN_BASE_URL, loginRoutes);
app.use(TAGS_BASE_URL, authorizationMiddleware, tagsRoutes);
app.use(EVENTS_BASE_URL, authorizationMiddleware, eventsRoutes);
app.use(REPORTS_BASE_URL, authorizationMiddleware, reportsRoutes);

const queryRouter = express.Router();

// eslint-disable-next-line consistent-return
queryRouter.post('/', async (req, res) => {
  const { rawQuery } = req.body;
  try {
    const result = await sql.raw(rawQuery);

    return res.json(result);
  } catch (error) {
    res.locals.sendError({
      status: 500,
      title: 'Raw query gone wrong.',
      detail: error.message,
    });
  }
});

app.use('/query', authorizationMiddleware, queryRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});
