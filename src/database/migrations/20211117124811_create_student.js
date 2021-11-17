/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('students', table => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('cpf').notNullable();
    table.string('telefone').notNullable();
    table.string('email').notNullable();
    table.string('cep').notNullable();
    table.string('rua').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('students');
};
