// https://stackoverflow.com/a/62892482/785985
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = dirname(FILENAME);

export const diretorio = {
  FILENAME,
  DIRNAME,
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: `${DIRNAME}/dev.sqlite3`,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${DIRNAME}/migrations`,
      // directory: './migrations',
    },
    seeds: {
      directory: `${DIRNAME}/seeds`,
      // directory: './seeds',
    },
    useNullAsDefault: true,
    // debug: true,
  },

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
