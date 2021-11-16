/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('employee', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('cpf').notNullable();
    table.string('rg').notNullable();
    table.string('telefone').notNullable();
    table.string('cep').notNullable();
    table.string('rua').notNullable();
    table.string('cargo').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('employee');
};
