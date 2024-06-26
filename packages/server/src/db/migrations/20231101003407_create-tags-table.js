/* eslint-disable import/extensions */
import { TAGS_TABLE_NAME } from '../constants/tags.constants.js';

export const up = (knex) =>
  knex.schema.createTable(TAGS_TABLE_NAME, (table) => {
    table.increments('id');
    table.string('name', 255).notNullable().unique();
    // "UI id" to be used on UI platforms instead of the regular id
    table.string('uiid', 11).notNullable().unique();
    table.string('color', 6).notNullable();
    table.string('backgroundColor', 6).notNullable();
    table.boolean('isPrivate').notNullable().defaultTo(true);
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);
  });

export const down = (knex) => knex.schema.dropTable(TAGS_TABLE_NAME);
