/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('publications_publishingCompany', table => {
    table.increments('id').notNullable();

    /* Criando Relação com Publications */
    table
      .integer('publication_id')
      .notNullable()
      .references('id')
      .inTable('publications')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    /* Criando Relação com Editora */
    table
      .integer('pb_company_id')
      .notNullable()
      .references('id')
      .inTable('publishing_company')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('publications_publishingCompany');
};
