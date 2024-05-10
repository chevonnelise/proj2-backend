const express = require('express');
const router = express.Router();
const { checkIfAuthenticated } = require('../middlewares');

// cart service layer
const cart  = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', [checkIfAuthenticated], async function(req,res){
    // 1. create line items that user is going to pay for
    const items = await cart.getCart(req.session.user.id);
    const lineItems = [];
    for (let i of items){
        const lineItem = {
            quantity: i.get('quantity'),
            // type: "invoiceitem",
            // set the price
            price_data:{
                currency: 'sgd',
                unit_amount: i.related('product').get('cost')*100,
                product_data:{
                    name:i.related('product').get('name'),
                    metadata:{
                        product_id: i.get('product_id')
                    }
                },
                // tax_behavior:"inclusive",
            },
        }

        // add image (if any) to the invoice
        if (i.related('product').get('image_url')){
            lineItem.price_data.product_data.images = [i.related('product').get('image_url')];
        }

        // push the finished line item into the array
        lineItems.push(lineItem);
    }

    // 2. create a payment session
    const payment = {
        payment_method_types:['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        metatdata:{
            user_id:req.session.userId
        }
    }
    // 3. register the payment session w stripe and return its id
    const paymentSession = await Stripe.checkout.sessions.create(payment);

    res.render('checkouts/index',{
        sessionId: paymentSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success', function(req,res){
    res.render('checkouts/success')
})

router.get('/cancel', function(req,res){
    res.render('checkouts/cancel')
})

router.post('/process_payment', express.raw({type:'application.json'}), async function(req,res){

    const payload = req.body;

    // retrieve endpoint secret
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET

    //signature header (Stripe provides one in the request)
    const sigHeader = req.headers['stripe-signature'];

    let event = null;

    try {
        // 1. extract payload and verify request is from Stripe
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

        // 2. retrieve payment session sent to Stripe to get payment
        if (event.type == 'checkut.session.completed'){
            const stripeSession = event.data.object; 

            // grab full payment session
            const session = await Stripe.checkout.sessions.retrieve(
                stripeSession.id, {
                    expand: ['line_items']
                }
            );

            // grab full info about line items
            const lineItems = await Stripe.checkout.sessions.listLineItems(stripeSession.id,{
                expand:['data.price.product']
            });

            // 3. process order
            console.log("Session =", session);
            console.timeLog("Line Items =", lineItems);

            // 4. send a request back to Stripe
            res.json({
                'status':'Success'
            })
        } 
    } catch (error) {
        //if event is not from Stripe
        res.status(500).json({
            error:error
        })
    }

})
module.exports = router;