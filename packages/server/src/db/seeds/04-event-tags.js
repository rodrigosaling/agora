// eslint-disable-next-line import/extensions
import { EVENT_TAGS_TABLE_NAME } from '../constants/event-tags.constants.js';

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(EVENT_TAGS_TABLE_NAME).del();

  await knex(EVENT_TAGS_TABLE_NAME).insert([
    { eventId: 1, tagId: 1, order: 0 },
    { eventId: 1, tagId: 2, order: 1 },
    { eventId: 1, tagId: 3, order: 2 },
    { eventId: 2, tagId: 4, order: 0 },
    { eventId: 2, tagId: 1, order: 1 },
    { eventId: 2, tagId: 3, order: 2 },
    { eventId: 2, tagId: 2, order: 3 },
    { eventId: 3, tagId: 1, order: 0 },
    { eventId: 3, tagId: 5, order: 1 },
    { eventId: 4, tagId: 5, order: 0 },
    { eventId: 4, tagId: 4, order: 1 },
    { eventId: 5, tagId: 3, order: 0 },
  ]);
};
