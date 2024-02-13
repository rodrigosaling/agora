/* eslint-disable import/extensions */
import { EVENT_TAGS_TABLE_NAME } from '../constants/event-tags.constants.js';
import { EVENTS_TABLE_NAME } from '../constants/events.constants.js';
import { TAGS_TABLE_NAME } from '../constants/tags.constants.js';

export const up = (knex) =>
  knex.schema.createTable(EVENT_TAGS_TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('eventId').unsigned().notNullable();
    table.integer('tagId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);

    table.foreign('eventId').references('id').inTable(EVENTS_TABLE_NAME);
    table.foreign('tagId').references('id').inTable(TAGS_TABLE_NAME);
  });

export const down = (knex) => knex.schema.dropTable(EVENT_TAGS_TABLE_NAME);
