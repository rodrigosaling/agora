import express from 'express';
import cors from 'cors';

import { TAGS_BASE_URL, router as tagsRoutes } from './routes/tags.routes';
import { LOGIN_BASE_URL, router as loginRoutes } from './routes/login.routes';
import { router as authorizationMiddleware } from './middlewares/authorization-middleware';

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});
