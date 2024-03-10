export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('tags').del();

  // Inserts seed entries
  // await knex('tags').insert([
  //   { name: 'lola' },
  //   { name: 'fred' },
  //   { name: 'casa' },
  // ]);
};
