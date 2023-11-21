export const up = (knex) =>
  knex.schema.createTable('familyPeople', (table) => {
    table.increments('id');
    table.integer('peopleId').unsigned().notNullable();
    table.integer('familyId').unsigned().notNullable();
    table.boolean('isDeleted').notNullable().defaultTo(false);
    table.timestamps(true, true, true);

    table.foreign('peopleId').references('id').inTable('people');
    table.foreign('familyId').references('id').inTable('families');
  });

export const down = (knex) => knex.schema.dropTable('familyPeople');
