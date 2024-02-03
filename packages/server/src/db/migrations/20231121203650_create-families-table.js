export const up = (knex) =>
  knex.schema.createTable('families', (table) => {
    table.increments('id');
    table.string('name', 60).notNullable();
    // "UI id" to be used on UI platforms instead of the regular id
    table.string('uiid', 11).notNullable().unique();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);
  });

export const down = (knex) => knex.schema.dropTable('families');
