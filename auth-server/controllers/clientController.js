import {db} from "../config/dbconnect.js";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';


const registerClient = async(req, res) =>{
   const { appName, redirectUri, developerEmail } = req.body;

   if (!appName) {
      return res.status(400).json({ message: "App Name is required." });
    }


   if (!appName || !redirectUri) {
     return res.status(400).json({ message: "App Name and Redirect URI are required." });
   }
 
   const clientId = appName + "." + uuidv4();
   const clientSecretPlain = uuidv4();
   const clientSecretHash = bcrypt.hashSync(clientSecretPlain, 10);
 
   const sql = `
     INSERT INTO client (clientId, clientSecret, appName, redirectUri, developerEmail)
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
       clientSecret: clientSecretPlain, 
     });
   });
}

//const loginClient

export{registerClient, 
   //loginClient
}; 