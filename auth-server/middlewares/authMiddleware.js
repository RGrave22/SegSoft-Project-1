import jwt from "jsonwebtoken";
import { db } from "../config/dbconnect.js";
import bcrypt  from "bcryptjs";




 const handleTokenRequest = async(req, res) => {
  const { grant_type, code, redirect_uri, client_id } = req.body;

  console.log("Client ID:", client_id);
  console.log("Redirect URI:", redirect_uri);

  if (grant_type !== "authorization_code") {
    return res.status(400).json({ error: "unsupported_grant_type" });
  }

  if (!code || !redirect_uri) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const sql = `
    SELECT * FROM authorizationCode
    WHERE code = ? AND client_id = ? AND redirect_uri = ?
  `;

  db.get(sql, [code, client_id, redirect_uri], (err, row) => {
    if (err) {
      console.error("Error searching code:", err.message);
      return res.status(500).json({ error: "server_error" });
    }

    if (!row) {
      return res.status(400).json({ error: "Invalid authentication credentials" });
    }

    const createdAt = new Date(row.createdAt);
    const expiresIn = row.expiresIn || 600;
    const now = new Date();

    if ((now - createdAt) / 1000 > expiresIn) {
      return res.status(400).json({ error: "Invalid authentication credentials" });
    }

    const payload = {
      sub: row.userId,
      client_id: row.client_id,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN_JWT || "1h",
    });

    console.log(accessToken);

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

async function validateClientMiddleware(req, res, next) {
    try {
        const { client_id, client_secret } = req.body;

        console.log("Checking client credentials");

        if (!client_id || !client_secret) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        db.get('SELECT * FROM client WHERE clientId = ?', [client_id], async (err, row) => {
            if (err) {
                console.error('Error in DB:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (!row) {
                return res.status(401).json({ error: 'Invalid client credentials' });
            }

            try {
                const match = await bcrypt.compare(client_secret, row.clientSecret);

                if (!match) {
                    return res.status(401).json({ error: 'Invalid client credentials' });
                }

                next();
            } catch (bcryptErr) {
                console.error('Error in bcrypt:', bcryptErr.message);
                return res.status(500).json({ error: 'Error validating credentials' });
            }
        });

    } catch (err) {
        console.error('Middleware error', err.message);
        res.status(500).json({ error: 'Middleware error' });
    }
}

function validateIdAndUrl(req, res, next) {
    const client_id = req.query.client_id;
    const redirect_uri = req.query.redirect_uri;


    if (!client_id || !redirect_uri) {
        return res.status(400).json({ error: 'Invalid client credentials' });
    }

    db.get('SELECT * FROM client WHERE clientId = ? AND redirect_uri = ?', [client_id, redirect_uri], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!row) {
            return res.status(401).json({ error: 'Unauthorized client' });
        }

        next();
    });
}



 export { handleTokenRequest, validateClientMiddleware, validateIdAndUrl };
