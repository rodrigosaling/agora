export const up = (knex) =>
  knex.schema.createTable('families', (table) => {
    table.increments('id');
    table.string('name', 60).notNullable();
    table.string('hash', 11).notNullable().unique();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(true, true, true);
  });

export const down = (knex) => knex.schema.dropTable('families');
