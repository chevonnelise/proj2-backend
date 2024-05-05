const {CartItem} = require("../models");

//get items by an ID
const getCart = async function(userId){
    return await CartItem.collection()
        .where({
            'user_id':userId
        }).fetch({
            require:false,
            withRelated:['product','product.category', 'product.brand']
        })
}

const getCartItemByUserAndProduct = async function(userId, productId){
    return await CartItem.where({
        'user_id':userId,
        'product_id':productId
    }).fetch({
        require:false
    });
}

const createCartItem = async function(userId, productId, quantity){
    const cartItem = new CartItem({
        user_id: userId,
        product_id: productId,
        quantity: quantity
    });
    await cartItem.save();
    return cartItem;
}

const removeFromCart = async function(userId, productId){
    const cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem){
        await cartItem.destroy();
        return true;
    }
    return false;
}

const updateQuantity = async function(userId, productId, newQuantity){
    const cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem){
        cartItem.set('quantity', newQuantity);
        await cartItem.save();
        return true;
    } 
    return false;
}

module.exports = {getCart,getCartItemByUserAndProduct, createCartItem, removeFromCart, updateQuantity};