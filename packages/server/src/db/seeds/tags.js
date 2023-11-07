/* eslint-disable import/prefer-default-export */
export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('tags').del();

  // Inserts seed entries
  await knex('tags').insert([
    { id: 1, name: 'lola' },
    { id: 2, name: 'fred' },
    { id: 3, name: 'casa' },
  ]);
};
