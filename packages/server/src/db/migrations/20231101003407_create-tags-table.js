/* eslint-disable import/extensions */
import { TAGS_TABLE_NAME } from '../constants/tags.constants.js';

export const up = (knex) =>
  knex.schema.createTable(TAGS_TABLE_NAME, (table) => {
    table.increments('id');
    table.string('name', 255).notNullable().unique();
    table.string('hash', 11).notNullable().unique();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(true, true, true);
  });

export const down = (knex) => knex.schema.dropTable(TAGS_TABLE_NAME);
