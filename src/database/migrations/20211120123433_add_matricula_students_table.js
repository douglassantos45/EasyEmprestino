exports.up = function (knex) {
  return knex.schema.table('students', table => {
    table.string('matricula').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('students', table => {
    table.dropColumn('matricula');
  });
};
