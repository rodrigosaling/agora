export const up = (knex) =>
  knex.schema.createTable('people', (table) => {
    table.increments('id');
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    // "UI id" to be used on UI platforms instead of the regular id
    table.string('uiid', 11).notNullable().unique();
    table.timestamps(true, true, true);
  });

export const down = (knex) => knex.schema.dropTable('people');
