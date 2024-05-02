// setup express
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(
    express.urlencoded({
        'extended': false
    })
);

async function main(){
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');

    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
}

main();

app.listen(3000, ()=>{
    console.log(`server has started`);
})