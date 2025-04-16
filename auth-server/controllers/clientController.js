import {db} from "../config/dbconnect.js";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';


const registerClient = async(req, res) =>{
   const { appName, developerEmail, redirectUri } = req.body;


   if (!appName) {
      return res.status(400).json({ message: "App Name is required." });
    }


   if (!appName) {
     return res.status(400).json({ message: "App Name and Redirect URI are required." });
   }
 
   const clientId = appName + "." + uuidv4();
   const clientSecretPlain = uuidv4();
   const clientSecretHash = bcrypt.hashSync(clientSecretPlain, 10);
 
   const sql = `
     INSERT INTO client (clientId, clientSecret, appName, developerEmail, redirect_uri)
     VALUES (?, ?, ?, ?, ?)
   `;
 
   db.run(sql, [clientId, clientSecretHash, appName, developerEmail, redirectUri], function (err) {
     if (err) {
       console.error("Erro ao registar aplicação:", err.message);
       return res.status(500).json({ message: "Erro ao registar aplicação." });
     }
 
     return res.send(`
               <!DOCTYPE html>
               <html>
                 <head>
                 <title>Aplication Successfully Signed Up</title>
                 <link rel="stylesheet" type="text/css" href="/css/index.css">
                 </head>
                 <body>
                 <div class="token-container">
                     <h1>Aplication Successfully Signed Up</h1> 
                     <h2>Client Id: </h2>
                     <p>${clientId}</p>
                     <h2>Client Secret: </h2>
                     <p>${clientSecretPlain}</p> 
                     </div>
                 </body>
               </html>
             `);
   });
}




export{registerClient

}; 