import express from 'express';
import knex from 'knex';
import knexConfig from './db/knexfile';

const app = express();
const port = 3000;

const env = process.env.NODE_ENV || 'development';
// console.log({ env, diretorio, knexConfig });
const sql = knex(knexConfig[env]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/select', (req, res) => {
  sql('tags')
    .select({
      id: 'id',
      name: 'name',
    })
    .then((tags) => res.json(tags));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});
