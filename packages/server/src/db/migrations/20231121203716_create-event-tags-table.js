export const up = (knex) =>
  knex.schema.createTable('eventTags', (table) => {
    table.increments('id');
    table.integer('eventId').unsigned().notNullable();
    table.integer('tagId').unsigned().notNullable();
    table.timestamps(true, true, true);

    table.foreign('eventId').references('id').inTable('events');
    table.foreign('tagId').references('id').inTable('tags');
  });

export const down = (knex) => knex.schema.dropTable('eventTags');
