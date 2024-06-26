// in the Bookshelf ORM, a model represents 1 table in the database
// command is issued in JS and the model translates commands to SQL

// when you require a file, and it's a js file, can omit the extension
// when you require a file, and it's a index.js file, can omit the filename
const bookshelf = require('../bookshelf');

// create Product model
// (arg1, arg2) = (model name, config object)
const Product = bookshelf.model('Product',{
    tableName:'products',
    category:function(){
        return this.belongsTo('Category');
    },
    brand:function(){
        return this.belongsTo('Brand');
    },
    tags:function(){
        return this.belongsToMany('Tag');
    }
})

// model name is singular with uppercase first alphabet
const Category = bookshelf.model('Category',{
    // table name should be plural
    tableName:'categories',
    //name of relationship is in plural form
    products:function(){
        return this.hasMany('Product');
    }
})

const Brand = bookshelf.model('Brand',{
    // table name should be plural
    tableName:'brands',
    //name of relationship is in plural form
    products:function(){
        return this.hasMany('Product');
    }
})

const Tag = bookshelf.model('Tag',{
    tableName:'tags',
    products:function(){
        return this.belongsToMany('Product');
    }
})

const User = bookshelf.model('User',{
    tableName:'users'
})

const CartItem = bookshelf.model('CartItem',{
    tableName:'cart_items',
    product:function(){
        return this.belongsTo('Product');
    },
    user:function(){
        return this.belongsTo('User');
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
})

const Order = bookshelf.model('Order',{
    tableName:'order',
    orderItem:function(){
        return this.hasMany('OrderItem');
    }
})

const OrderItem = bookshelf.model('OrderItem', {
    tableName:'order_item',
    product:function() {
        return this.belongsTo('Product');
    },
    order:function(){
        return this.belongsTo('Order');
    }
})

module.exports = {Product, Category, Brand, Tag, User, CartItem, BlacklistedToken, Order, OrderItem}