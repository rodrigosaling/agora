export const up = (knex) =>
  knex.schema.createTable('people', (table) => {
    table.increments('id');
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('hash', 11).notNullable().unique();
    table.timestamps(true, true, true);
  });

export const down = (knex) => knex.schema.dropTable('people');
