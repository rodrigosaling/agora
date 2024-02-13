/* eslint-disable import/extensions */
import {
  GROUP_PEOPLE_TABLE_NAME,
  GROUPS_TABLE_NAME,
} from '../constants/group.constants.js';
import { PEOPLE_TABLE_NAME } from '../constants/people.constants.js';

export const up = (knex) =>
  knex.schema.createTable(GROUP_PEOPLE_TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('personId').unsigned().notNullable();
    table.integer('groupId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);

    table.foreign('personId').references('id').inTable(PEOPLE_TABLE_NAME);
    table.foreign('groupId').references('id').inTable(GROUPS_TABLE_NAME);
  });

export const down = (knex) => knex.schema.dropTable(GROUP_PEOPLE_TABLE_NAME);
