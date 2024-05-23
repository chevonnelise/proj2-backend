const express = require('express');
const router = express.Router();

const cartServices = require('../../services/cart_services');
const {checkIfAuthenticated} = require('../../middlewares');

router.get('/:user_id', async function(req,res){
    const currentLoggedInUser = req.params.user_id;
    const cartItems = await cartServices.getCart(currentLoggedInUser);
    console.log(cartItems);
    res.json({
        cartItems: cartItems.toJSON()
    });
});

// [checkIfAuthenticated]
router.post('/add', async function(req,res){
    const productId = req.body.productId;
    const userId = req.body.userId;
    const cartItem = await cartServices.addToCart(userId, productId, 1);
    res.json({
        cartItem: cartItem
    })
})

// [checkIfAuthenticated],

router.post('/remove', async function(req,res){
    const productId = req.body.productId;
    const userId = req.body.userId;
    const cartItem = await cartServices.removeFromCart(userId, productId);
    res.json({
        cartItem: cartItem
    })
})

// [checkIfAuthenticated],
router.post("/updatequantity", async function(req,res){
    const productId = req.body.productId;
    const userId = req.body.userId;
    const cartItem = await cartServices.updateQuantity(userId, productId, req.body.newQuantity);
    res.json({
        cartItem: cartItem
    })
})

module.exports = router;