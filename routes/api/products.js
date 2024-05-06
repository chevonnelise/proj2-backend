const express = require('express');
const router = express.Router();

const productDataLayer = require('../../dal/products');
const { createProductForm } = require('../../forms');
const { Product } = require('../../models');

router.get('/', async function(req,res){
    const allProducts = await productDataLayer.getAllProducts();
    res.json({
        'product': allProducts.toJSON()
    })
})

router.post('/', async function (req,res){
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async function(form){
            const {tags, ...productData} = form.data;
            const product = await productDataLayer.createProduct(productData);
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            res.json({
                product: product.toJSON()
            })
        },
        'empty': function(form){
            res.send(401).json("missing details");
        }, 
        'error': function(form){
            let errors = {};
            for (let key in form.fields){
                // check for errors in keys
                const error = form.fields[key].error;
                if (error){
                    error[key] = error;
                }
            }
            res.json({
                'errors':errors
            })
        }
    })
})

module.exports = router;