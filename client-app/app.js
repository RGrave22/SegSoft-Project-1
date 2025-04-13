

const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
const router = express.Router();

dotenv.config({ path: path.resolve(__dirname, '.env') });

router.use(session({
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
//     clientID: 'asasas.f9ad9721-fcc1-48f6-929f-1d718db3bf11', 
//     clientSecret : '0bd8bc5f-a100-45d4-8dc0-8fda6e179e37', 
//     callbackURL: 'http://localhost:3000/callback',
// }, (accessToken, refreshToken, profile, cb) => {
//       console.log('Access Token:', accessToken);
//       console.log('Refresh Token:', refreshToken);
//       console.log('Profile:', profile);
//       profile.accessToken = accessToken;
//       session.accessToken = accessToken;
//     return cb(null, profile);
// }));

passport.use('oauth2', new OAuth2Strategy({
  authorizationURL: 'https://segsoft-project-1.onrender.com/authorize',
  tokenURL: 'https://segsoft-project-1.onrender.com/token',
  clientID: 'asasas.f9ad9721-fcc1-48f6-929f-1d718db3bf11', 
  clientSecret : '0bd8bc5f-a100-45d4-8dc0-8fda6e179e37', 
  callbackURL: 'https://segsoft-project-1-client.onrender.com/callback',
}, (accessToken, refreshToken, profile, cb) => {
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Profile:', profile);
    profile.accessToken = accessToken;
    session.accessToken = accessToken;
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
      
        console.log(JSON.stringify(req.user));
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
                <p>${session.accessToken}</p>
            </div>
            </body>
          </html>
        `);
    }
  );

app.get('/callback', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});


app.use(express.static(path.join(__dirname, 'www')));

app.listen(port, () => {
    console.log(`Client app running at http://localhost:${port}`);
});
