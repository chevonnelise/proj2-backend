const express = require('express');
const router = express.Router();

const cartServices = require('../services/cart_services');
const {checkIfAuthenticated} = require('../middlewares');

router.get('/', async function(req,res){
    const currentLoggedInUser = req.session.user.id;
    const cartItems = await cartServices.getCart(currentLoggedInUser);
    res.render('cart/index',{
        cartItems: cartItems.toJSON()
    });
});

router.get('/:product_id/add', [checkIfAuthenticated], async function(req,res){
    const productId = req.params.product_id;
    await cartServices.addToCart(req.session.user.id, productId, 1);
    req.flash('success_messages','Product added to the shopping cart successfully.');
    res.redirect('/cart');
})

router.get('/:product_id/remove', [checkIfAuthenticated], async function(req, res){
    const productId = req.params.product_id;
    const cartItem = await cartServices.getCart(req.session.user.id, productId);
    if (cartItem) {
        if (cartItem.quantity > 0) {
            // Decrease quantity if it's greater than 0
            await cartServices.decreaseQuantity(req.session.user.id, productId);
            req.flash('success_messages', "Quantity of the product in the shopping cart has been decreased successfully.");
        } else {
            // Remove from cart if quantity is 0
            const removed = await cartServices.removeFromCart(req.session.user.id, productId);
            if (removed) {
                req.flash('success_messages', "Product has been removed from the shopping cart successfully.");
            } else {
                req.flash('error_messages', "Failed to remove product from the shopping cart.");
            }
        }
        res.redirect('/cart');
    } else {
        req.flash('error_messages', "Product not found in the shopping cart.");
        res.redirect('/cart');
    }
});


module.exports = router;