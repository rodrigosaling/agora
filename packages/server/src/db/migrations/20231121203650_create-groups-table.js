/* eslint-disable import/extensions */
import { GROUPS_TABLE_NAME } from '../constants/group.constants.js';

export const up = (knex) =>
  knex.schema.createTable(GROUPS_TABLE_NAME, (table) => {
    table.increments('id');
    table.string('name', 60).notNullable();
    // "UI id" to be used on UI platforms instead of the regular id
    table.string('uiid', 11).notNullable().unique();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);
  });

export const down = (knex) => knex.schema.dropTable(GROUPS_TABLE_NAME);
