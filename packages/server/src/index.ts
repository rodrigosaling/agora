import express from 'express';
import cors from 'cors';

import { TAGS_BASE_URL, router as tagsRoutes } from './routes/tags.routes';
import { LOGIN_BASE_URL, router as loginRoutes } from './routes/login.routes';
import {
  EVENTS_BASE_URL,
  router as eventsRoutes,
} from './routes/events.routes';
import { router as authorizationMiddleware } from './middlewares/authorization-middleware';

import { sql } from './db/sql';
import { createErrorResponse } from './utils/build-error-response';

const app = express();
const port = 3000;

app.use(cors());
// app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.json()); // to support JSON-encoded bodies

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use(LOGIN_BASE_URL, loginRoutes);
app.use(TAGS_BASE_URL, authorizationMiddleware, tagsRoutes);
app.use(EVENTS_BASE_URL, authorizationMiddleware, eventsRoutes);

const queryRouter = express.Router();

// eslint-disable-next-line consistent-return
queryRouter.post('/', async (req, res) => {
  const sendError = createErrorResponse(req, res);
  const { rawQuery } = req.body;
  try {
    const result = await sql.raw(rawQuery);

    return res.json(result);
  } catch (error) {
    sendError({
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
