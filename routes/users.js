const express = require('express');
const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');
const {User} = require('../models');
const router = express.Router();
const crypto = require('crypto');
const { checkIfAuthenticated } = require('../middlewares');

const getHashedPassword = function(plainPassword){
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(plainPassword).digest('base64');
    return hash;
}

router.get('/register', (req,res)=>{
    const userForm = createRegistrationForm();
    res.render('users/register',{
        userForm: userForm.toHTML(bootstrapField)
    })
})

router.post('/register', (req,res)=>{
    const userForm = createRegistrationForm();
    userForm.handle(req,{
        'success': async function(form){
            const user = new User({
                username: form.data.username,
                password: getHashedPassword(form.data.password),
                email: form.data.email
            });
            await user.save();
            req.flash('success_messages', "Your account has been created successfully!");
            res.redirect('/users/login');
        },
        'empty':function(form){
            res.render('users/register',{
                userForm: form.toHTML(bootstrapField)
            })
        }, 
        'error':function(form){
            res.render('users/register',{
                userForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req,res)=>{
    const loginForm = createLoginForm();
    res.render('users/login',{
        loginForm: loginForm.toHTML(bootstrapField)
    });
})

router.post('/login',(req,res)=>{
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        'success': async function(form){
            // 1) find user by their email
            const user = await User.where({
                'email': form.data.email
            }).fetch({
                require:false
            });
            
            // if user is found
            if(user){
            // 2) check if the hashed ver of the pw from the form
            // matches the pw in the user table
                if (getHashedPassword(form.data.password) === user.get('password')){
                     // 3) if matched, then we will store the user in the session
                     // save the user data to session BUT don't save password to session (security flaw)
                     req.session.user = {
                        id: user.get('id'),
                        username: user.get('username'),
                        email: user.get('email')
                     }
                     req.flash("success_messages", `Welcome back ${user.get('username')}`);
                     res.redirect('/products')
                } else {
                    req.flash('error_messages',"Invalid user or password")
                    res.status(401);
                    res.redirect('/users/login');
                }
            } else {
                req.flash('error_messages',"Invalid user or password");
                res.status(401);
                res.redirect('/users/login');
            }
        },
        'empty':function(form){
            res.render('users/login',{
                loginForm: loginForm.toHTML(bootstrapField)
            });
        }, 
        'error':function(form){
            res.render('users/login',{
                loginForm: loginForm.toHTML(bootstrapField)
            });
        }
    })
})

router.get('/profile', [checkIfAuthenticated], (req,res)=>{
    const user = req.session.user;
    res.render('users/profile',{
        user
    })
})

router.get('/logout', (req,res)=>{
    req.session.user = null;
    req.flash('success_messages',"Goodbye! You have been successfully logged out.")
    res.redirect('/users/login');
})
module.exports = router;