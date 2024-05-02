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

exports.up = function(db) {
  return db.createTable('products',{
    'id':{
      'type':'int',
      'primaryKey':true,
      'autoIncrement':true,
      'unsigned':true
    },
    'name':{
      'type':'string',
      'length':100,
      'notNull':true
    },
    'cost':{
      'type':'decimal',
      'precision': 10,
      'scale': 2,
      'notNull': true
    },
    'description':{
      'type':'text',
      'notNull':true
    },
    'quantity':{
      'type':'int',
      'unsigned':true,
      'notNull':true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
