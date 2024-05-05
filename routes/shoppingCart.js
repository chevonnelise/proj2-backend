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
    req.flash('success_messages','Product added to the shopping cart successfully');
    res.redirect('/cart');
})

module.exports = router;