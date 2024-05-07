const cartDataLayer = require('../dal/cart_items');
// const { Product } = require('../models');

async function addToCart(userId, productId, quantity) {

    const cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId);
    if (cartItem){
        // existing item, increase qty by 1
        await cartDataLayer.updateQuantity(userId, productId, cartItem.get('quantity')+1);
    } else {
        await cartDataLayer.createCartItem(userId,productId,quantity);
    }
    return true;
}

async function getCart(userId) {
    const cartItems = await cartDataLayer.getCart(userId);

    // Get tags from cart items
    // const cartTags = cartItems.map(item => item.tags);

    // if (cartTags.length === 0) {
    //     // If there are no tags in the cart items, return an empty array of recommended products
    //     return { cartItems: cartItems, recommendedItems: [] };
    // }

    // // Get products with any of the tags from cartTags
    // const recommendedProducts = await Product.query(queryBuilder => {
    //     queryBuilder.innerJoin('product_tags', 'products.id', 'product_tags.product_id')
    //         .whereIn('product_tags.tag_id', cartTags)
    //         .groupBy('products.id')
    //         .limit(5);
    // }).fetchAll({ withRelated: ['category', 'tags', 'brand'] });

    // return { cartItems: cartItems, recommendedItems: recommendedProducts };
    return cartItems;
}

async function removeFromCart(userId, productId) {
    return await cartDataLayer.removeFromCart(userId, productId);
}

async function updateQuantity(userId, productId, newQuantity){
    return await cartDataLayer.updateQuantity(userId, productId, newQuantity);
}

module.exports = {addToCart, getCart, removeFromCart, updateQuantity}

