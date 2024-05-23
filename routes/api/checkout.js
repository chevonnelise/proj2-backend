const express = require('express');
const router = express.Router();
const { checkIfAuthenticated } = require('../../middlewares');

// cart service layer
const productDAL  = require('../../dal/products');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


router.post('/', async function(req,res){
    // 1. create line items that user is going to 
    const items = req.body.cartItems;
    console.log(items)
    const lineItems = [];
    const order = await productDAL.
    for (let [product_id,quantity] of Object.entries(items)){
        const product = await productDAL.getProductById(product_id);
        console.log(product)
        if (quantity === 0 )
            continue;
        const lineItem = {
            quantity: quantity,
            // type: "invoiceitem",
            // set the price
            price_data:{
                currency: 'sgd',
                unit_amount: product.get('cost')*100,
                product_data:{
                    name:product.get('name'),
                    metadata:{
                        product_id: product_id
                    }
                },
                // tax_behavior:"inclusive",
            },
        }

        // add image (if any) to the invoice
        if (product.get('image_url')){
            lineItem.price_data.product_data.images = [product.get('image_url')];
        }
        console.log(lineItem)
        // push the finished line item into the array
        lineItems.push(lineItem);
    }

    // 2. create a payment session
    const payment = {
        payment_method_types:['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL_FRONTEND,
        cancel_url: process.env.STRIPE_CANCEL_URL_FRONTEND,
        metatdata:{
            user_id:req.session.userId
        }
    }
    // 3. register the payment session w stripe and return its id
    const paymentSession = await Stripe.checkout.sessions.create(payment);
    console.log(paymentSession)
    res.json({"url" :paymentSession.url})
    // res.render('checkouts/index',{
    //     sessionId: paymentSession.id,
    //     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    // })
})


module.exports = router;