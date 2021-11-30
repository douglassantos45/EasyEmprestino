/* eslint-disable spaced-comment */
/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('lends', table => {
    table.increments('id').primary();
    table.string('start').notNullable();
    table.string('end').notNullable();

    //Criando Relação com funcionário
    table
      .integer('employee_id')
      .notNullable()
      .references('id')
      .inTable('employees')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    //Criando Relação com publicação
    table
      .integer('publication_id')
      .notNullable()
      .references('id')
      .inTable('publications_knowledgeAreas')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    //Criando Relação com estudante
    table
      .integer('student_id')
      .notNullable()
      .references('id')
      .inTable('students')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('lends');
};
