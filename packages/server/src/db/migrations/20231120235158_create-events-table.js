/* eslint-disable import/extensions */
import { EVENTS_TABLE_NAME } from '../constants/events.constants.js';

export const up = (knex) =>
  knex.schema.createTable(EVENTS_TABLE_NAME, (table) => {
    table.increments('id');
    table.datetime('date').notNullable();
    // "UI id" to be used on UI platforms instead of the regular id
    table.string('uiid', 11).notNullable().unique();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);
  });

export const down = (knex) => knex.schema.dropTable(EVENTS_TABLE_NAME);
