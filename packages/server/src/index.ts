import express from 'express';
import cors from 'cors';

import { TAGS_BASE_URL, router as tagsRoutes } from './tags.routes';
import { LOGIN_BASE_URL, router as loginRoutes } from './login.routes';

const app = express();
const port = 3000;

app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   })
// );
// app.options('*', cors()); // include before other routes

// app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.json()); // to support JSON-encoded bodies

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use(TAGS_BASE_URL, tagsRoutes);
app.use(LOGIN_BASE_URL, loginRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});
