const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OAuth2Strategy = require('passport-oauth2');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const routes = require('./routes');
const path = require("node:path");
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(':memory:');
const port = 9000;


app.use(express.static(path.join(__dirname, 'public')));

routes(app, db);

app.listen(port, () => {
    console.log(`Authorization Server running at http://localhost:9000`);
});