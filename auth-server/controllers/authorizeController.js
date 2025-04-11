import { db } from "../config/dbconnect.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const renderConsentPage = (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("Missing client_id or redirect_uri");
  }


  res.render("consent", {
    client_id,
    redirect_uri,
    state,
  });
};

const approveAuthorization = async (req, res) => {
  const { client_id, redirect_uri } = req.session;

  const code = uuidv4();

  // devemos presistir o redirectUrl??
  const sql = `
    INSERT INTO authorizationCode (code, clientId, clientSecret)
    VALUES (?, ?, ?)
  `;
  const userId = req.user?.email || "anonymous"; 

  db.run(sql, [code, client_id, redirect_uri, userId], (err) => {
    if (err) {
      console.error("Erro ao guardar código:", err.message);
      return res.status(500).send("Erro ao guardar o código de autorização.");
    }

    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set("code", code);
    if (state) redirectUrl.searchParams.set("state", state);
    
    res.redirect(redirectUrl.toString());
  });
};

const denyAuthorization = (req, res) => {
  res.status(403).send("Access denied by user.");
};

export { renderConsentPage, approveAuthorization, denyAuthorization };
