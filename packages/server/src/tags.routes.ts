import express from 'express';
import knex from 'knex';
import knexConfig from './db/knexfile';

const env = process.env.NODE_ENV || 'development';
const sql = knex(knexConfig[env]);

const router = express.Router();

const TAGS_BASE_URL = '/tags';

router.get('/', (req, res) => {
  // TODO move this a to another place, more global, if needed
  // if (req.method === 'OPTIONS') {
  //   res.set('Access-Control-Allow-Origin', '*');
  //   res.set('Access-Control-Allow-Headers', 'application/json');
  //   res.status(204).send('');
  // }

  sql('tags')
    .select({
      id: 'id',
      name: 'name',
    })
    .then((tags) => res.json(tags));
});

router.post('/', async (req, res) => {
  const { name } = req.body;

  const id = await sql('tags').insert({
    name,
  });

  res.json({ id });
});

router.put('/', async (req, res) => {
  const { name } = req.body;

  const id = await sql('tags').insert({
    name,
  });

  res.json({ id });
});

export { TAGS_BASE_URL, router };
