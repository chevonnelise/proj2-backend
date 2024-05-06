const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// function to generate the access token
const generateAccessToken = (user, tokenSecret, expiry) => {
    return jwt.sign({
        username: user.username,
        id: user.id,
        email: user.email
    }, tokenSecret, {
        expiresIn: expiry
    });
};



const getHashedPassword = function (plainPassword) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(plainPassword).digest('base64');
    return hash;
};

const {User, BlacklistedToken}  = require('../../models');

router.post('/login', async function(req,res){
    console.log(req.body);
    // find user by email
    const user = await User.where({
        'email': req.body.email
    }).fetch({
        required: false
    });
    // if the user with that email exists, check if hashed password
    // matches
    if (user && user.get('password') === getHashedPassword(req.body.password)) {
        // login is succcessful
        const accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, "10m");
        const refreshToken = generateAccessToken(user, process.env.REFRESH_TOKEN_SECRET, "1h")
        res.json({
            accessToken, refreshToken
        })
    } else {
        // login is not successful
        res.status(401);
        res.json({
            'error':'Invalid login credentials'
        })
    }
})

router.post('/refresh', async function(req,res){
    const refreshToken = req.body.refreshToken;
    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function(err,user){
            if (err) {
                return res.sendStatus(401);
            }

            // make sure that the given refresh token is not in the black list
            const blacklistedToken = await BlacklistedToken.where({
                'token': refreshToken
            }).fetch({
                require: false
            });

            // if the token is blacklisted
            if (blacklistedToken) {
                res.status(401);
                return res.json({
                    'error':'Invalid refresh token'
                })
            }

            // create a new access token and send back
            const accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, "10");
            res.json({
                accessToken
            })
        })
    } else {
        res.sendStatus(400);
    }
})

router.post('/logout', async function(req,res){
    // blacklist the refresh token
    const refreshToken = req.body.refreshToken;
    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function(err,user){
            const token = new BlacklistedToken({
                'token': refreshToken,
                'date_created': new Date()
            });
            await token.save();
            res.json({
                'message':"Logged out successfully"
            })
        })
    } else {
        res.status(400);
    }
})

module.exports = router;