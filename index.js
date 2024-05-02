// setup express
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

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

// enable sessions
app.use(session({
    store: new FileStore(), // store session in file
    secret: 'purple',
    resave: false,
    saveUninitialized: true // if a browser connects to the server w/o a session, connect a new one immediately
}))

// setup flash messages
app.use(flash()); // enable flash messages

// must do this after sessions are enabled - flash messages depend on sessions
app.use(function(req,res,next){
    console.log(req.session);
    next();
})


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