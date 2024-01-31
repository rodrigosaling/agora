/* eslint-disable import/prefer-default-export */
export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('people').del();

  // Inserts seed entries
  await knex('people').insert([
    {
      name: 'Rodrigo',
      email: 'rodrigosaling@gmail.com',
      uiid: 'a1b2c3e4e5f',
      passcode: '123456',
      refreshToken: 'abc123',
    },
  ]);
};
