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
// req.session is only available after you enable sessions
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
    // req.flash() w/o a 2nd parameter will
    // return the current flash message and delete it
    res.locals.success_messages = req.flash('success_messages');

    // error flash messages
    res.locals.error_messages = req.flash('error_messages');
    next();
})

// share the current logged in user with all hbs files
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
})

async function main(){
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users');

    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
}

main();

app.listen(3000, ()=>{
    console.log(`server has started`);
})