// eslint-disable-next-line import/extensions
import { EVENTS_TAGS_TABLE_NAME } from '../constants/event-tags.constants.js';

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(EVENTS_TAGS_TABLE_NAME).del();

  await knex(EVENTS_TAGS_TABLE_NAME).insert([
    { eventId: 1, tagId: 1, order: 0, tagGroup: '1;2;3' },
    { eventId: 1, tagId: 2, order: 1, tagGroup: '1;2;3' },
    { eventId: 1, tagId: 3, order: 2, tagGroup: '1;2;3' },
    { eventId: 2, tagId: 4, order: 0, tagGroup: '4;1;3;2' },
    { eventId: 2, tagId: 1, order: 1, tagGroup: '4;1;3;2' },
    { eventId: 2, tagId: 3, order: 2, tagGroup: '4;1;3;2' },
    { eventId: 2, tagId: 2, order: 3, tagGroup: '4;1;3;2' },
    { eventId: 3, tagId: 1, order: 0, tagGroup: '1;5' },
    { eventId: 3, tagId: 5, order: 1, tagGroup: '1;5' },
    { eventId: 4, tagId: 5, order: 0, tagGroup: '5;4' },
    { eventId: 4, tagId: 4, order: 1, tagGroup: '5;4' },
    { eventId: 5, tagId: 3, order: 0, tagGroup: '3' },
    { eventId: 6, tagId: 1, order: 0, tagGroup: '1;2;3' },
    { eventId: 6, tagId: 2, order: 1, tagGroup: '1;2;3' },
    { eventId: 6, tagId: 3, order: 2, tagGroup: '1;2;3' },
    { eventId: 7, tagId: 1, order: 0, tagGroup: '1;2;3' },
    { eventId: 7, tagId: 2, order: 1, tagGroup: '1;2;3' },
    { eventId: 7, tagId: 3, order: 2, tagGroup: '1;2;3' },
    { eventId: 8, tagId: 1, order: 0, tagGroup: '1;5' },
    { eventId: 8, tagId: 5, order: 1, tagGroup: '1;5' },
    { eventId: 9, tagId: 1, order: 0, tagGroup: '1;5' },
    { eventId: 9, tagId: 5, order: 1, tagGroup: '1;5' },
    { eventId: 10, tagId: 1, order: 0, tagGroup: '1;5' },
    { eventId: 10, tagId: 5, order: 1, tagGroup: '1;5' },
    { eventId: 11, tagId: 1, order: 0, tagGroup: '1;5' },
    { eventId: 11, tagId: 5, order: 1, tagGroup: '1;5' },
    { eventId: 12, tagId: 5, order: 0, tagGroup: '5;1' },
    { eventId: 12, tagId: 1, order: 1, tagGroup: '5;1' },
    { eventId: 13, tagId: 5, order: 0, tagGroup: '5;1' },
    { eventId: 13, tagId: 1, order: 1, tagGroup: '5;1' },
  ]);
};
