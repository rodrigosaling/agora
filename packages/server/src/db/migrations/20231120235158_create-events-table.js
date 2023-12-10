/* eslint-disable import/extensions */
import { EVENTS_TABLE_NAME } from '../constants/events.constants.js';

export const up = (knex) =>
  knex.schema.createTable(EVENTS_TABLE_NAME, (table) => {
    table.increments('id');
    table.datetime('date').notNullable();
    table.string('hash', 11).notNullable().unique();
    table.boolean('isPersonal').notNullable().defaultTo(true);
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(true, true, true);
  });

export const down = (knex) => knex.schema.dropTable(EVENTS_TABLE_NAME);
