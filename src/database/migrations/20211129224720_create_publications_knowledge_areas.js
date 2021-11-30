/* eslint-disable func-names */
/* eslint-disable arrow-parens */

exports.up = function (knex) {
  return knex.schema.createTable('publications_knowledgeAreas', table => {
    table.increments('id').notNullable();

    //Criando Relação com Publicações
    table
      .integer('publication_id')
      .notNullable()
      .references('id')
      .inTable('publications')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    //Criando Relação com Área do conhecimento
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
  return knex.schema.dropTable('publications_knowledgeAreas');
};
