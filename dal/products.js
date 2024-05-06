const { Product, Category, Tag, Brand} = require('../models');

async function getProductById(productId) {
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ['tags']  // when fetching the products, also fetch tags information
    });
    return product;
}

async function getAllProducts() {
    const products = await Product.collection().fetch({
        withRelated: ['category', 'tags']
    });
    return products;
}

async function getAllCategories() {
    const allCategories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);
    return allCategories;
}

async function getAllBrands() {
    const allBrands = await Brand.fetchAll().map(brand => [brand.get('id'), brand.get('name')]);
    return allBrands;
}


async function getAllTags() {
    const allTags = await Tag.fetchAll().map(t => [t.get('id'), t.get('name')]);
    return allTags;
}

async function createProduct(productData) {
    const product = new Product();


    // same as:
    // INSERT INTO products (name, cost, description)
    // VALUES (${form.data.name}, ${form.data.cost}, ${form.data.description})

    product.set('name', productData.name)
    product.set('cost', productData.cost);
    product.set('description', productData.description);
    product.set('quantity', productData.quantity);
    product.set('category_id', productData.category_id);
    product.set('brand_id', productData.brand_id);
    product.set('category_id', productData.category_id);

    product.set('image_url', productData.image_url);
    // save the product to the database
    await product.save();

    // save the tags relationship
    if (productData.tags) {
        // form.data.tags will be a string of the selected tag ids seperated by comma
        // eg: "1,2"
        await product.tags().attach(productData.tags.split(','));
    }

    return product;
}

async function updateProduct(product, newProductData) {
    product.set(newProductData);
    await product.save();
}

module.exports = {
    getAllProducts, 
    getAllCategories, 
    getAllTags, 
    getAllBrands,
    createProduct, 
    updateProduct,
    getProductById
}