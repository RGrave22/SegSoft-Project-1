const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const express = require('express');
const path = require('path');


const app = express();
const port = 3000;

// Configuração do OAuth2   
passport.use('oauth2', new OAuth2Strategy({
    authorizationURL: 'http://localhost:9000/authorize',
    tokenURL: 'http://localhost:9000/token',
    // clientID: 'my-client-id',
    clientID: 'asasas.26a30d78-299c-46e7-bc3b-0d42fcc1723b',
    // clientSecret: 'my-client-secret',
    clientSecret : '4082eaa2-c866-4742-9ebc-313aa6c10a68',
    callbackURL: 'http://localhost:3000/callback',
}, (accessToken, refreshToken, profile, cb) => {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile);
      profile.accessToken = accessToken;
    return cb(null, profile);
}));

app.get('/auth', passport.authenticate('oauth2'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});


app.get('/callback',
    passport.authenticate('oauth2', {
      failureRedirect: '/login',
      session: false
    }),
    (req, res) => {
      console.log('Authenticated user:', req.body);
        console.log('Authenticated response:', res.body);
      // Successful authentication
        res.send(JSON.stringify(req.user));
    }
  );


app.use(express.static(path.join(__dirname, 'www')));

app.listen(port, () => {
    console.log(`Client app running at http://localhost:${port}`);
});
