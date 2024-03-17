import { nanoid } from 'nanoid';
// eslint-disable-next-line import/extensions
import { TAGS_TABLE_NAME } from '../constants/tags.constants.js';

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(TAGS_TABLE_NAME).del();

  await knex(TAGS_TABLE_NAME).insert([
    { name: 'lola', uiid: nanoid(11) },
    { name: 'fred', uiid: nanoid(11) },
    { name: 'casa', uiid: nanoid(11) },
    { name: 'comeu grama', uiid: nanoid(11) },
    { name: 'médico', uiid: nanoid(11) },
  ]);
};
