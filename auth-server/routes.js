import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { register, login } from "./controllers/authController.js";
import { registerClient, /**loginClient **/} from "./controllers/clientController.js";

import verifyToken from "./middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import {db} from "./config/dbconnect.js";
import session from "express-session";

import {renderConsentPage, approveAuthorization, denyAuthorization} from './controllers/authorizeController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(session({
    secret: 'your-secret-key',  
    resave: false,              
    saveUninitialized: true,    
    cookie: { secure: false }   
}));


// Rotas públicas
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "client-app-register.html"));
});

router.get("/login", (req, res) => {
 

  res.sendFile(path.join(__dirname, "public", "login.html"));
 });

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

router.post("/login", login);
router.post("/register", register);

router.get("/authorize", (req, res) => {
  console.log(req.query);
  const { client_id, redirect_uri } = req.query; 
  
  req.session.redirect_uri = redirect_uri;
  req.session.client_id = client_id;
  

  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Registo de aplicações (clientes OAuth)
router.post("/register-client",registerClient );
//router.post("/login-client",loginClient);

// Endpoint de token (simples)
router.post("/token", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email em falta." });

  const accessToken = generateJWT(email);
  res.json({ accessToken });
});

router.get("/consent", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "consent.html"));
})

router.post("/consent", approveAuthorization);
router.post("/deny", denyAuthorization);



export default router;
