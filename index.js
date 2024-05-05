// setup express
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csurf = require('csurf');
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

// enable sessions
// req.session is only available after you enable sessions
app.use(session({
    store: new FileStore(), // store session in file
    secret: process.env.SESSION_SECRET,
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

// enable csurf for CSRF protection after sessions are enabled
// because csurf requires sessions to work
app.use(csurf());

// middleware to share the CSRF token with all hbs files
app.use((req,res,next)=>{
    // req.csrfToken( is avail because of 'app.use(csurf())'
    res.locals.csrfToken = req.csrfToken();
    next();
})

// middleware to handle csrf errors
app.use((err,req,res,next)=>{
    // if the middleware function has four parameters
    // then it is an error handler for the middlware directly before it
    if (err && err.code == "EBADCSRFTOKEN"){
        req.flash('error_messages',"The form has expired, please try again.");
        res.redirect('back'); // this redirects to go back 1 page
    } else {
        next();
    }
})

async function main(){
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users');
    const cloudinaryRoutes = require('./routes/cloudinary');
    const shoppingCartRoutes = require('./routes/shoppingCart');

    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/cart', shoppingCartRoutes)
}

main();

app.listen(3000, ()=>{
    console.log(`server has started`);
})