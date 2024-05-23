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
  return db.createTable('order_item',{
    id:{
      type:'int',
      unsigned:true,
      primaryKey:true,
      autoIncrement:true
    },
    product_id:{
      type:'int',
      notNull:true,
      unsigned:true,
      foreignKey:{
        name:'products_product_id_fk',
        table:'products',
        mapping:'id',
        rules:{
          onDelete:'CASCADE',
          onUpdate:'RESTRICT'
        }
      }
    },
    order_id:{
      type:'int',
      notNull:true,
      unsigned:true,
      foreignKey:{
        name:'order_order_id_fk',
        table:'order',
        mapping:'id',
        rules:{
          onDelete:'CASCADE',
          onUpdate:'RESTRICT'
        }
      }
    },
    order_quantity:{
      type:'int',
      notNull: true,
      unsigned:true,
    }
  })
};

exports.down = function(db) {
  return db.dropTable('order_item');
};

exports._meta = {
  "version": 1
};
