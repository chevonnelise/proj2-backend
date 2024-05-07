const express = require('express');
const router = express.Router();

// require in the model
const { Product, Tag } = require('../models');
const { createProductForm, bootstrapField, createSearchForm } = require('../forms');
// const { required } = require('forms/lib/validators');
const dataLayer = require('../dal');

router.get('/', async (req, res) => {

    // get all categories
    const allCategories = await dataLayer.getAllCategories();
    allCategories.unshift([0, '--------'])
    // get all brands
    const allBrands = await dataLayer.getAllBrands();
    allBrands.unshift([0, '--------'])
    // get all tags
    const allTags = await dataLayer.getAllTags();

    const searchForm = createSearchForm(allCategories, allBrands, allTags);
    searchForm.handle(req, {
        'success': async function (form) {
            // create new query builder
            // SELECT * FROM products
            const queryBuilder = Product.collection();

            // find user input
            if (form.data.name) {
                // WHERE name LIKE '%$(form.data.name)%'
                queryBuilder.where('name', 'like', '%' + form.data.name + '%');
            }

            if (form.data.min_cost){
                queryBuilder.where('cost', '>=', form.data.min_cost);
            }

            if (form.data.max_cost){
                queryBuilder.where('cost','<=', form.data.max_cost);
            }

            if (form.data.brand_id && form.data.brand_id != "0"){
                queryBuilder.where('brand_id', "=" , form.data.brand_id);
            }

            if (form.data.category_id && form.data.category_id != "0"){
                queryBuilder.where('category_id', "=" , form.data.category_id);
            }

            if (form.data.tags){
                queryBuilder.query('join','products_tags','products.id', 'product_id')
                    .where('tag_id','in',form.data.tags.split(','));
            }

            console.log(queryBuilder.query());
            const products = await queryBuilder.fetch({
                withRelated:['category','brand','tags']
            });
            console.log(products);
            res.render('products/index', {
                products: products.toJSON(),
                searchForm: form.toHTML(bootstrapField)
            });
        },
        'empty': async function (form) {
            // use the Product model to get all the products if user submits empty search form
            const products = await dataLayer.getAllProducts();

            res.render('products/index', {
                products: products.toJSON(),
                searchForm: searchForm.toHTML(bootstrapField)
            });
        },
        'error': async function (form) {
            // render empty array if error
            res.render('products/index', {
                products: [],
                searchForm: form.toHTML(bootstrapField)
            });
        }
    })
})

router.get('/add-product', async (req, res) => {
    // get all categories
    const allCategories = await dataLayer.getAllCategories();

    // get all brands
    const allBrands = await dataLayer.getAllBrands();

    // get all tags
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

    const productForm = createProductForm(allCategories, allBrands, allTags);
    console.log(process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_UPLOAD_PRESET)
    res.render('products/create', {
        form: productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/add-product', async (req, res) => {
    // create the product form object using caolan form
    // get all categories
    const allCategories = await dataLayer.getAllCategories();

    // get all brands
    const allBrands = await dataLayer.getAllBrands();

    // get all tags
    const allTags = await dataLayer.getAllTags();

    const productForm = createProductForm(allCategories, allBrands, allTags);
    // use the form object to handle the request
    productForm.handle(req, {
        // form user submitted has no error, pass in form as parameter
        'success': async function (form) {
            // create an instance of the Product model
            // an instance of a product is one row in the Product model
            const product = await dataLayer.createProduct(form.data);

            // a flash message can only be set before a redirect
            // arg1: message to show
            // arg2: what message to show
            req.flash('success_messages', 'New product has been created successfully.');
            // same as 
            // INSERT INTO products (name, description, sku, price, quantity)
            // VALUES (${form.data.name}, ${form.data.description}, ${form.data.sku}, ${form.data.price}, ${form.data.quantity})
            res.redirect("/products/");
        },
        // empty form submitted
        'empty': function (form) {
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        },
        // form has error
        'error': function (form) {
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/update-product/:productId', async (req, res) => {
    const productId = req.params.productId;

    // fetch the product we want to update
    // emulate: SELECT * from products WHERE id = ${productId}
    const product = await dataLayer.getProductById(productId);

    // get all categories
    const allCategories = await dataLayer.getAllCategories();

    // get all brands
    const allBrands = await dataLayer.getAllBrands();

    // get all tags
    const allTags = await dataLayer.getAllTags();

    const productForm = createProductForm(allCategories, allBrands, allTags);

    // prefill the form with values from the product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.quantity.value = product.get('quantity');
    productForm.fields.category_id.value = product.get('category_id');
    productForm.fields.brand_id.value = product.get('brand_id');

    // get the ids of all the tags that the product is related to
    const selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value = selectedTags;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/update-product/:productId', async (req, res) => {
    // create the form object
    const productForm = createProductForm();

    // use the form object to handle the request
    productForm.handle(req, {
        'success': async function (form) {
            // find the product that the user wants to modify
            const product = await Product.where({
                'id': req.params.productId
            }).fetch({
                require: true, // makes sure that the product exists
                withRelated: ['brand', 'tags']
            });

            // every key in form.data is one column in the product row
            const { tags, ...productData } = form.data;
            await dataLayer.updateProduct(product, productData);

            // convet tags from string to array
            const tagIds = tags.split(',');

            // remove all tags
            const existingTagIds = await product.related('tags').pluck('id')
            await product.tags().detach(existingTagIds);

            await product.tags().attach(tagIds);
            req.flash('success_messages', 'Product has been updated successfully.');
            res.redirect('/products/')
        },
        'empty': function (form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        },
        'error': function (form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })

})

router.get('/delete-product/:productId', async (req, res) => {
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });

    res.render('products/delete', {
        product: product.toJSON()
    })
})

router.post('/delete-product/:productId', async (req, res) => {
    // get the product which we want to delete
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        required: true
    });
    req.flash('error_messages', `${product.get('name')} has been deleted`)

    await product.destroy();
    res.redirect('/products/');
})

module.exports = router;