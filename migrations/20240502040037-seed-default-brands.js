'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  // table name, array of columns to insert into, values
  //
  // INSERT INTO products (name) VALUES ('Default')
  await db.insert("brands", ['name'],['Superfoods']);
  await db.insert("brands", ['name'],['California Gold']);
};

exports.down = function(db) {
  return db.runSql("DELETE FROM products");
};

exports._meta = {
  "version": 1
};
