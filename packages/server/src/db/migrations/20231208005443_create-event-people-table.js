export const up = (knex) =>
  knex.schema.createTable('eventPeople', (table) => {
    table.increments('id');
    table.integer('peopleId').unsigned().notNullable();
    table.integer('eventId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(false, true, true);

    table.foreign('peopleId').references('id').inTable('people');
    table.foreign('eventId').references('id').inTable('events');
  });

export const down = (knex) => knex.schema.dropTable('eventPeople');
