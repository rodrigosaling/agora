/* eslint-disable import/extensions */
import {
  GROUPS_PEOPLE_TABLE_NAME,
  GROUPS_TABLE_NAME,
} from '../constants/group.constants.js';
import { PEOPLE_TABLE_NAME } from '../constants/people.constants.js';

export const up = (knex) =>
  knex.schema.createTable(GROUPS_PEOPLE_TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('peopleId').unsigned().notNullable();
    table.integer('groupId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);

    table.foreign('peopleId').references('id').inTable(PEOPLE_TABLE_NAME);
    table.foreign('groupId').references('id').inTable(GROUPS_TABLE_NAME);
  });

export const down = (knex) => knex.schema.dropTable(GROUPS_PEOPLE_TABLE_NAME);
