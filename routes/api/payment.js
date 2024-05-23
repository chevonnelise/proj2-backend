const express = require('express');
const router = express.Router();

// cart service layer
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const productDAL  = require('../../dal/products');

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
        if (event.type == 'checkout.session.completed'){
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
            console.log("Line Items =", lineItems);

            // 4. reflect reduced quantity in database
            for (const item of lineItems.data) {
                const productId = item.price.product.metadata.product_id;
                const quantityPurchased = item.quantity;
                console.log(quantityPurchased);

                const product = await productDAL.getProductById(productId);
                if (product) {
                    product.set({
                        quantity : product.get('quantity') - quantityPurchased
                    })
                    //product.set('quantity') = product.get('quantity') - quantityPurchased;
                    console.log(product)
                    await product.save();
                }
            }

            // 5. send a request back to Stripe
            res.json({
                'status':'Success'
            })
        } 
    } catch (error) {
        //if event is not from Stripe
        console.log(error)
        res.status(500).json({
            error:error
        })
    }

})
module.exports = router;