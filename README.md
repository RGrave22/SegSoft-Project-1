# SegSoft-Project-1

<h4 style="color: red;">Important note: </h4>
We created this OAuth2.0 system as a Software Security course project,
giving this fact we hosted our system in a free Cloud application platform.
So we are informing you to expect some loading time from the Cloud platform when trying to access our server. 

## How to use our OAuth2.0 system

### Create your client application
- You can implement the application the way you want, but if are inexperienced we recommend and HTML front end following to a javascript backend. 

### Register your app
- Visit our client registration url [here](https://segsoft-project-1.onrender.com)
- Register your application with the required information.
- Get your application credentials.

### Create an OAuth2Strategy
- You have the following exampled implemented in Js:

``` 
    passport.use('oauth2', new OAuth2Strategy({
        authorizationURL: 'https://segsoft-project-1.onrender.com/authorize',
        tokenURL: 'https://segsoft-project-1.onrender.com/token',
        clientID: '<Your-client-id>',
        clientSecret : '<Your-client-secret>',
        callbackURL: '<Your-callback-url>',
        }, (accessToken, refreshToken, profile, cb) => {
            profile.accessToken = accessToken;
        return cb(null, profile);
    }));
```

- After make sure your app handles the callback request:

``` 
    app.get('/callback',
    passport.authenticate('oauth2', {
      failureRedirect: '/login',
      session: false
    }),
    (req, res) => {
      
        console.log("Token: " + req.user.accessToken);

        res.send(Your app next page)
    }
  );
```

- Make sure that you use good coding practices and strong security policies.
