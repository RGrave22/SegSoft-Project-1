const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const router = express.Router();

dotenv.config({ path: path.resolve(__dirname, '.env') });

app.use(passport.initialize());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

/**
 * LOCAL HOST
 * To use the app you have to sign up your app first on '/', get your clientID and clientSecret 
 * and change them here in this passport method, after that you can sign up and login without any problem to get your acessToken      
 */
// passport.use('oauth2', new OAuth2Strategy({
//     authorizationURL: 'http://localhost:9000/authorize',
//     tokenURL: 'http://localhost:9000/token',
//     clientID: 'boaspessoal.923773de-ccc3-4082-9652-cb4fe49f82e3',
//     clientSecret : '41d817f7-6381-443b-bad9-262815c920ce',
//     callbackURL: 'http://localhost:3000/callback',
// }, (accessToken, refreshToken, profile, cb) => {
//         console.log('Access Token:', accessToken);
//         console.log('Refresh Token:', refreshToken);
//         console.log('Profile:', profile);
//         profile.accessToken = accessToken;
//         //const user = { accessToken, refreshToken };
//     return cb(null, profile);
// }));

passport.use('oauth2', new OAuth2Strategy({
  authorizationURL: 'https://segsoft-project-1.onrender.com/authorize',
  tokenURL: 'https://segsoft-project-1.onrender.com/token',
  clientID: 'ololololoo.485fbe33-7166-4198-9508-bd76b72adc99',
  clientSecret : 'f7d6d709-1d55-4564-9752-0a61628b966f',
  callbackURL: 'https://segsoft-project-1-client.onrender.com/callback',
}, (accessToken, refreshToken, profile, cb) => {
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Profile:', profile);
    profile.accessToken = accessToken;
    return cb(null, profile);
}));


app.get('/callback',
    passport.authenticate('oauth2', {
      failureRedirect: '/login',
      session: false
    }),
    (req, res) => {
      
        console.log("Token: " + req.user.accessToken);

        req.session.accessToken = req.user.accessToken;

        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
            <title>Generated token</title>
            <link rel="stylesheet" type="text/css" href="/css/style.css">
            </head>
            <body>
            <div class="token-container">
                <h1>Welcome, you have been sucessfully authenticated</h1>
                <h2>Acess token: </h2>
                <p>${req.session.accessToken}</p>
            </div>
            </body>
          </html>
        `);
    }
  );


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

app.get('/auth', passport.authenticate('oauth2'));

app.use(express.static(path.join(__dirname, 'www')));

app.listen(port, () => {
    console.log(`Client app running at http://localhost:${port}`);
});
