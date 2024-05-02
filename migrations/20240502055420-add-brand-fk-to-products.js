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
  return db.addColumn('products','brand_id',{
    type:'int',
    unsigned:true,
    notNull:true,
    defaultValue:1,
    foreignKey:{
      name:'product_brand_fk',
      table:'brands',
      mapping:'id',
      rules:{
        onDelete:'CASCADE',
        onUpdate:'RESTRICT'
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('products','product_brand_fk');
  await db.removeColumn('brand_id')
};

exports._meta = {
  "version": 1
};
