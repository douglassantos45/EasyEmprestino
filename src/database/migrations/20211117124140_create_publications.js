/* eslint-disable spaced-comment */
/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('publications', table => {
    table.increments('id').primary();
    table.string('cota').notNullable();
    table.string('titulo').notNullable();
    table.string('autores').notNullable();

    //Criando Relação com funcionário
    table
      .integer('employee_id')
      .notNullable()
      .references('id')
      .inTable('employee')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    //Criando Relação com Área do Conhecimento
    table
      .integer('knowledge_area_id')
      .notNullable()
      .references('id')
      .inTable('knowledge_areas')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('publications');
};
