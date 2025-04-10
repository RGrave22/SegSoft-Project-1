const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const express = require('express');
const path = require('path');


const app = express();

const port = 3000;

passport.use('oauth2', new OAuth2Strategy({
    authorizationURL: 'http://localhost:9000/authorize',
    tokenURL: 'http://localhost:9000/token',
    clientID: 'my-client-id',
    clientSecret: 'my-client-secret',
    callbackURL: 'http://localhost:3000/callback',
}, (accessToken, refreshToken, profile, cb) => {
    // Handle access token and profile here
    console.log('Access Token:', accessToken);
    return cb(null, profile);
}));

app.get('/auth', passport.authenticate('oauth2'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(port, () => {
    console.log('Client app running at http://localhost:3000');
});