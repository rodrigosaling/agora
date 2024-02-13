/* eslint-disable import/extensions */
import { EVENTS_TABLE_NAME } from '../constants/events.constants.js';
import {
  GROUPS_TABLE_NAME,
  GROUP_EVENT_TABLE_NAME,
} from '../constants/group.constants.js';

export const up = (knex) =>
  knex.schema.createTable(GROUP_EVENT_TABLE_NAME, (table) => {
    table.increments('id');
    table.integer('groupId').unsigned().notNullable();
    table.integer('eventId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);

    table.foreign('groupId').references('id').inTable(GROUPS_TABLE_NAME);
    table.foreign('eventId').references('id').inTable(EVENTS_TABLE_NAME);
  });

export const down = (knex) => knex.schema.dropTable(GROUP_EVENT_TABLE_NAME);
