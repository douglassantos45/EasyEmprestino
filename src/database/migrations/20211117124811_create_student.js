/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('students', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('cpf').notNullable();
    table.string('registration').notNullable();
    table.string('phone');
    table.string('email').notNullable();
    table.string('cep').notNullable();
    table.string('street').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('students');
};
