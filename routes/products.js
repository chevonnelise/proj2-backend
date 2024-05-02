const express = require('express');
const router = express.Router();

// require in the model
const {Product} = require('../models');
const {createProductForm, bootstrapField} = require('../forms');
// const { required } = require('forms/lib/validators');

router.get('/', async (req,res)=> {
    // use the Product model to get all the products
    const products = await Product.collection().fetch();
    res.render('products/index', {
        products: products.toJSON()
    }
);
})

router.get('/add-product', (req,res)=>{
    const productForm = createProductForm();
    res.render('products/create',{
        form: productForm.toHTML(bootstrapField)
    })
})

router.post('/add-product', (req,res)=>{
    // create the product form object using caolan form
    const productForm = createProductForm();
    // use the form object to handle the request
    productForm.handle(req, {
        // form user submitted has no error, pass in form as parameter
        'success': async function(form) {
            // access each field in the submitted form
            // use form.data.<fieldname>

            // create an instance of the Product model
            // an instance of a product is one row in the Product model
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('quantity', form.data.quantity);
            
            // save the product to the database
            await product.save();

            // same as 
            // INSERT INTO products (name, description, sku, price, quantity)
            // VALUES (${form.data.name}, ${form.data.description}, ${form.data.sku}, ${form.data.price}, ${form.data.quantity})
            res.redirect("/products/");
        },
        // empty form submitted
        'empty': function(form){
            res.render('products/create',{
                form: form.toHTML(bootstrapField)
            })
        },
        // form has error
        'error': function(form){
            res.render('products/create',{
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/update-product/:productId', async (req,res)=>{
    const productId = req.params.productId;

    // fetch the product we want to update
    // emulate: SELECT * from products WHERE id = ${productId}
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true
    });

    // create the product form
    const productForm = createProductForm();
    
    // prefill the form with values from the product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.quantity.value = product.get('quantity');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/update-product/:productId', async (req,res)=>{
    // create the form object
    const productForm = createProductForm();

    // use the form object to handle the request
    productForm.handle(req,{
        'success': async function(form){
            // find the product that the user wants to modify
            const product = await Product.where({
                'id': req.params.productId
            }).fetch({
                require: true // makes sure that the product exists
            });

            // every key in form.data is one column in the product row
            product.set(form.data);
            await product.save();
            res.redirect('/products/')
        },
        'empty': function(form){
            res.render('products/update',{
                form: form.toHTML(bootstrapField)
            })
        },
        'error': function(form){
            res.render('products/update',{
                form: form.toHTML(bootstrapField)
            })
        }
    })

})

router.get('/delete-product/:productId', async(req,res)=>{
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });

    res.render('products/delete', {
        product: product.toJSON()
    })
})

router.post('/delete-product/:productId', async(req,res)=>{
    // get the product which we want to delete
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });

    await product.destroy();
    res.redirect('/products');
})

module.exports = router;