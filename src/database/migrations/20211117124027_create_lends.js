/* eslint-disable spaced-comment */
/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('lends', table => {
    table.increments('id').primary();
    table
      .timestamp('inicio')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
    table.string('termino').notNullable();

    //Criando Relação com funcionário
    table
      .integer('employee_id')
      .notNullable()
      .references('id')
      .inTable('employee')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    //Criando Relação com publicação
    table
      .integer('publication_id')
      .notNullable()
      .references('id')
      .inTable('publications')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('lends');
};
