/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('employees', table => {
    table.string('id').notNullable();
    table.string('name').notNullable();
    table.string('cpf').notNullable();
    table.string('rg').notNullable();
    table.string('mail').notNullable();
    table.string('password').notNullable();
    table.string('phone').notNullable();
    table.string('cep').notNullable();
    table.string('street').notNullable();
    table.string('charge').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('employees');
};
