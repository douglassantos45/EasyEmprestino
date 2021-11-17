/* eslint-disable spaced-comment */
/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('knowledge_areas', table => {
    table.increments('id').primary();
    table.string('tipo').notNullable();

    //Criando Relação com Funcionários
    table
      .integer('employee_id')
      .notNullable()
      .references('id')
      .inTable('employee')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('knowledge_areas');
};
