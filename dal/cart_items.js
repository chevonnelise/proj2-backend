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
        return cartItem; // Return true if the removal was successful
    }
    return false; // Return false if the cart item doesn't exist
}

// const decreaseQuantity = async function(userId, productId){
//     const cartItem = await getCartItemByUserAndProduct(userId, productId);
//     if (cartItem && cartItem.quantity > 1) {
//         cartItem.set('quantity', cartItem.quantity - 1);
//         await cartItem.save();
//         return true; // Return true if the quantity decreased
//     }
//     return false; // Return false if the cart item doesn't exist or the quantity is already 1
// }


const updateQuantity = async function(userId, productId, newQuantity){
    const cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem){
        cartItem.set('quantity', newQuantity);
        await cartItem.save();
        return cartItem;
    } 
    return false;
}


module.exports = {getCart,getCartItemByUserAndProduct, createCartItem, removeFromCart, updateQuantity};