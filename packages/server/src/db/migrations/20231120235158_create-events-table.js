/* eslint-disable import/extensions */
import { EVENTS_TABLE_NAME } from '../constants/events.constants.js';
import { PEOPLE_TABLE_NAME } from '../constants/people.constants.js';

export const up = (knex) =>
  knex.schema.createTable(EVENTS_TABLE_NAME, (table) => {
    table.increments('id');
    table.datetime('date').notNullable();
    // "UI id" to be used on UI platforms instead of the regular id
    table.string('uiid', 11).notNullable().unique();
    table.string('color', 6).notNullable();
    table.string('backgroundColor', 6).notNullable();
    table.integer('ownerId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);

    table.foreign('ownerId').references('id').inTable(PEOPLE_TABLE_NAME);
  });

export const down = (knex) => knex.schema.dropTable(EVENTS_TABLE_NAME);
