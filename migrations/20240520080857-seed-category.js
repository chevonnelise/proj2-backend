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
  await db.insert("categories", ['name'],['Tablet']);
  await db.insert("categories", ['name'],['Powder']);
  await db.insert("categories", ['name'],['Capsules']);
  await db.insert("categories", ['name'],['Gummies']);
};

exports.down = function(db) {
  return db.runSql("DELETE FROM categories");
};

exports._meta = {
  "version": 1
};
