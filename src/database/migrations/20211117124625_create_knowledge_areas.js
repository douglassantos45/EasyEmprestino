/* eslint-disable spaced-comment */
/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('knowledge_areas', table => {
    table.string('id').notNullable();
    table.string('type').notNullable();

    //Criando Relação com Funcionários
    table
      .integer('employee_id')
      .notNullable()
      .references('id')
      .inTable('employees')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('knowledge_areas');
};
