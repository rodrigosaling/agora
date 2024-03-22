import { nanoid } from 'nanoid';
// eslint-disable-next-line import/extensions
import { EVENTS_TABLE_NAME } from '../constants/events.constants.js';

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(EVENTS_TABLE_NAME).del();

  await knex(EVENTS_TABLE_NAME).insert([
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
    { date: new Date().toISOString(), uiid: nanoid(11), ownerId: 1 },
  ]);
};
