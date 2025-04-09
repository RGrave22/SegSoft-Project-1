const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const routes = require('./routes');

const app = express();

const port = 9000;


routes(app);


app.listen(port, () => {
    console.log(`Authorization Server running at http://localhost:${port}`);
});