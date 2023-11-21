export const up = (knex) =>
  knex.schema.createTable('events', (table) => {
    table.increments('id');
    table.datetime('date').notNullable();
    table.boolean('isPersonal').notNullable().defaultTo(true);
    table.timestamps(true, true, true);
  });

export const down = (knex) => knex.schema.dropTable('events');
