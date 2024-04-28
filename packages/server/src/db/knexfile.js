// https://stackoverflow.com/a/62892482/785985
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenvx from '@dotenvx/dotenvx';

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = dirname(FILENAME);

// used when running knex CLI migrate and seed scripts
dotenvx.config({ path: '../../.env' });

export const path = {
  FILENAME,
  DIRNAME,
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'pg',
    // using a function so dotenvx can inject env vars before connecting
    connection: () => ({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      database: process.env.DATABASE_SCHEMA,
      password: process.env.DATABASE_PASSWORD,
      ssl: false,
    }),
  },

  // development: {
  //   client: 'better-sqlite3',
  //   connection: {
  //     filename: `${DIRNAME}/dev.sqlite3`,
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //     directory: `${DIRNAME}/migrations`,
  //     // directory: './migrations',
  //   },
  //   seeds: {
  //     directory: `${DIRNAME}/seeds`,
  //     // directory: './seeds',
  //   },
  //   useNullAsDefault: true,
  //   // debug: true,
  // },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user: 'username',
  //     password: 'password',
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //   },
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user: 'username',
  //     password: 'password',
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations',
  //   },
  // },
};
