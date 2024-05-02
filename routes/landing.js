const express = require('express');

const router = express.Router();

router.get('/', (req,res)=>{
    res.render('landing/index');
})

router.get('/about', (req,res)=>{
    res.render("landing/about");
})

router.get('/contact', (req,res)=>{
    res.render("landing/contact");
})

module.exports = router;