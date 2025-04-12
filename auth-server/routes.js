import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { register, login } from "./controllers/authController.js";
import { registerClient, validateIdAndUrl} from "./controllers/clientController.js";

import {/**verifyToken, **/handleTokenRequest} from "./middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import {db} from "./config/dbconnect.js";
import session from "express-session";
import dotenv from 'dotenv';


import {renderConsentPage, approveAuthorization, denyAuthorization} from './controllers/authorizeController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

dotenv.config({ path: path.resolve(__dirname, '.env') });


router.use(session({
    secret: process.env.SESSION_SECRET,   
    resave: false,              
    saveUninitialized: true,    
    cookie: { secure: false }   
}));

router.get("/authorize", (req, res) => {
  console.log(req.query);
  const { client_id, redirect_uri } = req.query; 
  
  req.session.redirect_uri = redirect_uri;
  req.session.client_id = client_id;

  const val = validateIdAndUrl(client_id, redirect_uri);

  if(!val){
    res.status(401).send('Unauthorized client');
  }

  res.sendFile(path.join(__dirname, "public", "login.html"));
});


router.post("/consent", approveAuthorization);

router.post("/deny", denyAuthorization);

router.post("/token", handleTokenRequest);

router.post("/register-client", registerClient);

router.post("/approve", approveAuthorization);

router.post("/login", login);

router.post("/register", register);


router.get("/consent", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "consent.html"));
})

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "client-app-register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
 });

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

export default router;
