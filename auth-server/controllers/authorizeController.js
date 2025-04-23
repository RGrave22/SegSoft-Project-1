import { db } from "../config/dbconnect.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";


const approveAuthorization = (req, res) => {
  const { client_id, redirect_uri, state } = req.session;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("Missing required info");
  }

  if (!req.session.user) {
    return res.status(401).send("Invalid session");
  }

  const code = uuidv4(); 
  const userId = req.session.user.email; 
  const date = new Date();

  const sql = `
    INSERT INTO authorizationCode (code, client_id, redirect_uri, userId, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [code, client_id, redirect_uri, userId, date], (err) => {
    if (err) {
      console.error("Erro ao guardar código:", err.message);
      return res.status(500).send("Erro ao guardar o código de autorização.");
    }
    
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set("code", code);
    if (state) redirectUrl.searchParams.set("state", state);

    console.log("Redirecting to");
    console.log(redirectUrl);

    return res.redirect(redirectUrl.toString());
  });
};


const denyAuthorization = (req, res) => {
  res.status(403).send("Access denied by user.");
};

export { approveAuthorization, denyAuthorization };
