exports.up = function (knex) {
  return knex.schema.table('employee', table => {
    table.string('email').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropColumn('email');
};
