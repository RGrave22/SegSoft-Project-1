import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { register, login } from "./controllers/authController.js";
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
router.post("/register-client", (req, res) => {
  const { appName, redirectUri, developerEmail } = req.body;

  if (!appName || !redirectUri) {
    return res.status(400).json({ message: "App Name e Redirect URI são obrigatórios." });
  }

  const clientId = appName + "." + uuidv4();
  const clientSecretPlain = uuidv4();
  const clientSecretHash = bcrypt.hashSync(clientSecretPlain, 10);

  const sql = `
    INSERT INTO clients (clientId, clientSecret, appName, redirectUri, developerEmail)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [clientId, clientSecretHash, appName, redirectUri, developerEmail], function (err) {
    if (err) {
      console.error("Erro ao registar aplicação:", err.message);
      return res.status(500).json({ message: "Erro ao registar aplicação." });
    }

    return res.status(201).json({
      message: "Aplicação registada com sucesso.",
      clientId,
      clientSecret: clientSecretPlain, // Mostrado uma vez
    });
  });
});

// Endpoint de token (simples)
router.post("/token", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email em falta." });

  const accessToken = generateJWT(email);
  res.json({ accessToken });
});

function generateJWT(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "1h",
  });
}

export default router;
