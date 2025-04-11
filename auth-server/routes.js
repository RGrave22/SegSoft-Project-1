import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { register, login } from "./controllers/authController.js";
import { registerClient, /**loginClient **/} from "./controllers/clientController.js";

import verifyToken from "./middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import { db } from "./config/dbconnect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

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

// Página de consentimento
router.get("/authorize", (req, res) => {
  // Aqui poderás validar sessão ou JWT
  res.sendFile(path.join(__dirname, "public", "consent.html"));
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


export default router;
