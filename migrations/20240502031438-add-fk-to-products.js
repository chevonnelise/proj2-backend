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
  // 1) table name, 
  // 2) table FK referencing, 
  // 3) object with FK and value FK is pointing to
  // 4) name of FK
  // 5) FK rules
  return db.addForeignKey('products', 'categories', 'product_category_fk',{
    'category_id':'id'
  },{
    onDelete:"CASCADE",
    onUpdate:"RESTRICT"
  });
};

exports.down = function(db) {
  // 1) table name
  // 2) name of FK 
  return db.removeForeignKey('products', 'product_category_fk');
};

exports._meta = {
  "version": 1
};
