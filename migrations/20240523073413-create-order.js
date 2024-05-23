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
  return db.createTable('order',{
    id:{
      type:'int',
      unsigned:true,
      primaryKey:true,
      autoIncrement:true
    },
    user_id:{
      type:'int',
      notNull:true,
      unsigned:true,
      foreignKey:{
        name:'users_user_id_fk',
        table:'users',
        mapping:'id',
        rules:{
          onDelete:'CASCADE',
          onUpdate:'RESTRICT'
        }
      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('order');
};

exports._meta = {
  "version": 1
};
