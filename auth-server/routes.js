const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('node:path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));


module.exports = (app) => {

    app.get('/authorize', (req, res) => {
        if(req.session.user) {

        }


        res.send('Authorization Endpoint');
    });


    app.post('/token', (req, res) => {
        const username = req.body;

        const accessToken = generateJWT(username);
        res.json({accessToken});
    });
};






function generateJWT(username) {
    const expTime = process.env.JWT_EXPIRATION;
    const secret = process.env.JWT_SECRET;

    return jwt.sign({userId: username}, secret, {expiresIn: expTime});
}


