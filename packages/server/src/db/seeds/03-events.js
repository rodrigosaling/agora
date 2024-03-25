import { nanoid } from 'nanoid';
// eslint-disable-next-line import/extensions
import { EVENTS_TABLE_NAME } from '../constants/events.constants.js';

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(EVENTS_TABLE_NAME).del();

  await knex(EVENTS_TABLE_NAME).insert([
    { date: new Date(2024, 2, 1), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 2), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 3), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 4), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 5), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 6), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 7), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 8), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 9), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 10), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 11), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 12), uiid: nanoid(11), ownerId: 1 },
    { date: new Date(2024, 2, 13), uiid: nanoid(11), ownerId: 1 },
  ]);
};
