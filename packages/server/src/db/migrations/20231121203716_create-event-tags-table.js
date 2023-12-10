/* eslint-disable import/extensions */
import { EVENT_TAGS_TABLE_NAME } from '../constants/event-tags.constants.js';

export const up = (knex) =>
  knex.schema.createTable(EVENT_TAGS_TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('eventId').unsigned().notNullable();
    table.integer('tagId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(true, true, true);

    table.foreign('eventId').references('id').inTable('events');
    table.foreign('tagId').references('id').inTable('tags');
  });

export const down = (knex) => knex.schema.dropTable(EVENT_TAGS_TABLE_NAME);
