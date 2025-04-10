const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');


const app = express();

app.use(express.static(path.join(__dirname, 'public')));



module.exports = (app,db) => {

    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY, username TEXT, passwor TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS clients (clientId INTEGER PRIMARY KEY, appName TEXT, clientSecret TEXT)");
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'client-app-register.html'));
    });

    app.get('/authorize', (req, res) => {
        if(!req.user) {
            return res.redirect('/login');
        }

        //GPT
        //const { client_id, redirect_uri, state } = req.query;
        //req.session.authRequest = { client_id, redirect_uri, state };

        //GPT
        res.sendFile(path.join(__dirname, 'public', 'consent.html'));
    });


    app.post('/token', (req, res) => {
        const username = req.body;

        const accessToken = generateJWT(username);
        res.json({accessToken});
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    app.post('/login', (req, res) => {
        const {username, password} = req.body;
    });

    app.post('/register-client', (req, res) => {
        const {app_name, redirect_uri, developer_email} = req.body;

        if (!app_name || !redirect_uri) {
            return res.status(400).json({ message: 'App Name and Redirect URL are required' });
        }


        const clientId = app_name + "." + uuidv4();
        const clientSecretBeforeHash = uuidv4();

        const clientSecretHashed = bcrypt.hashSync(clientSecretBeforeHash, 10);



    });


};


function generateJWT(username) {
    const expTime = process.env.JWT_EXPIRATION;
    const secret = process.env.JWT_SECRET;

    return jwt.sign({userId: username}, secret, {expiresIn: expTime});
}


