import knex from 'knex';
import knexConfig from './knexfile';
import { ENV } from '../constants/env.constants';

export const sql = knex(knexConfig[ENV]);
