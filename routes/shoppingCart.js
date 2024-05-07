const express = require('express');
const router = express.Router();

const cartServices = require('../services/cart_services');
const {checkIfAuthenticated} = require('../middlewares');

router.get('/', async function(req,res){
    const currentLoggedInUser = req.session.user.id;
    const cartItems = await cartServices.getCart(currentLoggedInUser);
    console.log(cartItems);
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

router.get('/:product_id/remove', [checkIfAuthenticated], async function(req,res){
    const productId = req.params.product_id;
    await cartServices.removeFromCart(req.session.user.id, productId);
    req.flash('success_messages', 'Product has been removed from the shopping cart');
    res.redirect('/cart');
})

router.post("/:product_id/updateQuantity", [checkIfAuthenticated], async function(req,res){
    const productId = req.params.product_id;
    await cartServices.updateQuantity(req.session.user.id, productId, req.body.newQuantity);
    req.flash('success_messages', 'Quantity has been updated!');
    res.redirect('/cart');

})

module.exports = router;