export const up = (knex) =>
  knex.schema.createTable('tags', (table) => {
    table.increments('id');
    table.string('name', 255).notNullable().unique();
    table.timestamps(true, true, true);
  });

export const down = (knex) => knex.schema.dropTable('tags');
