const { Product, Category, Tag, Brand, OrderItem, Order} = require('../models');

async function getProductById(productId) {
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ['tags']  // when fetching the products, also fetch tags information
    });
    return product;
}

async function getOrderById(userId) {
    const order = await Order.where({
        'user_id': userId,
    }).fetch({
        require: true,
        withRelated:['orderItem.product']
    });
    return order;
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

    product.set('name', productData.name);
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

async function createOrder(orderData) {
    const order = new Order();
    order.set('user_id', orderData.user_id);
    await order.save();
    return order;
}

async function createOrderItem(orderData){
    const orderItem = new OrderItem();
    orderItem.set('order_id',orderData.order_id);
    orderItem.set('product_id',orderData.product_id);
    orderItem.set('order_quantity',orderData.quantity);
    await orderItem.save();
    return orderItem;
}

module.exports = {
    getOrderById,
    getAllProducts, 
    getAllCategories, 
    getAllTags, 
    getAllBrands,
    createProduct, 
    updateProduct,
    getProductById,
    createOrder,
    createOrderItem
}