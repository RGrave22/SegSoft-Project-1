import jwt from "jsonwebtoken";
import { db } from "../config/dbconnect.js";
import bcrypt  from "bcryptjs";

 const handleTokenRequest = async(req, res) => {
  const { grant_type, code, redirect_uri, client_id, client_secret } = req.body;

  console.log("Client ID:", client_id);
  console.log("Redirect URI:", redirect_uri);

  const isValidClient = await validateClient(client_id, client_secret);
  
  if(!isValidClient){
    console.log("CLIENTE INVALIDO")
    return res.status(401).json({ error: "Unauthorized Client" });
  }

  if (grant_type !== "authorization_code") {
    return res.status(400).json({ error: "unsupported_grant_type" });
  }

  if (!code || !redirect_uri || !client_id || !client_secret) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const sql = `
    SELECT * FROM authorizationCode
    WHERE code = ? AND client_id = ? AND redirect_uri = ?
  `;

  db.get(sql, [code, client_id, redirect_uri], (err, row) => {
    if (err) {
      console.error("Erro ao procurar código:", err.message);
      return res.status(500).json({ error: "server_error" });
    }

    if (!row) {
      return res.status(400).json({ error: "invalid_grant" });
    }

    const createdAt = new Date(row.createdAt);
    const expiresIn = row.expiresIn || 600;
    const now = new Date();

    if ((now - createdAt) / 1000 > expiresIn) {
      return res.status(400).json({ error: "expired_code" });
    }

    const payload = {
      sub: row.userId,
      client_id: row.client_id,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN_JWT || "1h",
    });

    db.run(`DELETE FROM authorizationCode WHERE code = ?`, 
      [code], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting the authorization co:", deleteErr.message);
        return res.status(500).json({ error: "server_error" });
      }

    });

    return res.json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600, 
    });
  });
};

async function  validateClient  (client_id, client_secret)  {
  return new Promise((resolve, reject) =>{
    db.get('SELECT * FROM client WHERE clientId = ?', 
      [client_id], async (err, row) => {

      if (err) {
        console.error(err.message);
        return reject(err);

      } else if (row) {
        console.log(client_secret);
        console.log(row.clientSecret);
        const match = await bcrypt.compare(client_secret, row.clientSecret);
        
        if(!match){
          return resolve(false);
        }
        
        return resolve(true);

      } else {
        return resolve(false);
      }
    });
  });
}


 export { handleTokenRequest };
