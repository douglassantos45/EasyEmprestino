/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('students', table => {
    table.string('id').notNullable();
    table.string('name').notNullable();
    table.string('cpf').notNullable();
    table.string('registration').notNullable();
    table.string('phone');
    table.string('mail').notNullable();
    table.string('cep').notNullable();
    table.string('street').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('students');
};
