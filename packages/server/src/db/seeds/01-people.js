/* eslint-disable import/extensions */
import { PEOPLE_TABLE_NAME } from '../constants/people.constants.js';

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex(PEOPLE_TABLE_NAME).del();

  // Inserts seed entries
  await knex(PEOPLE_TABLE_NAME).insert([
    {
      name: 'Rodrigo',
      email: 'rodrigosaling@gmail.com',
      uiid: 'a1b2c3e4e5f',
      passcode: '123456',
      refreshToken: 'abc123',
    },
  ]);
};
