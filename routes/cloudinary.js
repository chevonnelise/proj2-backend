const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary');
cloudinary.config({
    'cloud_name':process.env.CLOUDINARY_NAME,
    'api_key': process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_API_SECRET
})

router.get('/sign', async (req,res)=>{
    // syntax for Cloudinary Upload Widget
    const params = req.query.params_to_sign;
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    // the signature is similar to CSRF protection
    const signature = cloudinary.utils.api_sign_request(params, apiKey, apiSecret);
    res.send(signature);
})

module.exports = router;