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
  // for pivot table, the table name must be:
  // 1) a combination of the two tables in plural form
  // 2) arranged in alphabetical order
  // 3) separated by an underscore
  return db.createTable('products_tags',{
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
        name:'products_tags_product_fk',
        table:'products',
        mapping:'id',
        rules:{
          onDelete:'CASCADE',
          onUpdate:'RESTRICT'
        }
      }
    },
    tag_id:{
      type:'int',
      notNull:true,
      unsigned:true,
      foreignKey:{
        name:'products_tags_tag_fk',
        table:'tags',
        mapping:'id',
        rules:{
          onDelete:'CASCADE',
          onUpdate:'RESTRICT'
        }
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('products_tags','products_tags_product_fk')
  await db.removeForeignKey('products_tags','products_tags_tag_fk')
  await db.dropTable('products_tags');
};

exports._meta = {
  "version": 1
};
