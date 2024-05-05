const { Product, Category, Tag, Brand } = require('../models');

async function getProductById(productId){
    // fetch the product we want to update
    // emulate: SELECT * from products WHERE id = ${productId}
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ['tags'] // fetch the tag info when fetching the product
    });
    return product;
}

async function getAllProducts() {
    const products = await Product.collection().fetch({
        withRelated: ['category', 'tags', 'brand']
    });
    return products;
}

async function getAllCategories() {
    // get all categories
    const allCategories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);
    return allCategories;
}

async function getAllTags() {
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
    return allTags;
}

async function getAllBrands() {
    const allBrands = await Brand.fetchAll().map(brand => [brand.get('id'), brand.get('name')]);
    return allBrands;
}

async function createProduct(productData) {
    // create an instance of the Product model
    // an instance of a product is one row in the Product model
    const product = new Product();
    product.set('name', productData.name);
    product.set('cost', productData.cost);
    product.set('description', productData.description);
    product.set('quantity', productData.quantity);
    product.set('category_id', productData.category_id);
    product.set('brand_id', productData.brand_id);
    product.set('image_url', productData.image_url);

    // save the product to the database
    await product.save();

    // save the tags relationship
    if (productData.tags) {
        // tags are separated by commas
        await product.tags().attach(productData.tags.split(','));
    }

    return product;
}

async function updateProduct(product, newProductData) {
    product.set(newProductData);
    await product.save();
}


module.exports = {
    getProductById, getAllProducts, getAllCategories, getAllTags, getAllBrands, createProduct, updateProduct
}