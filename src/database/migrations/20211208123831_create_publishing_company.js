/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('publishing_company', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('publishing_company');
};
