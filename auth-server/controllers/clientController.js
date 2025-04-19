import {db} from "../config/dbconnect.js";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from "path";
import validator from 'email-validator';
import express from "express";

const __filename = new URL(import.meta.url).pathname;


const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

//app.use(express.static(path.join(__dirname, 'public')));

const registerClient = async(req, res) =>{
   const { appName, developerEmail, redirectUri } = req.body;


   if (!appName && !redirectUri) {
      return res.status(400).json({ message: "Invalid Credentials" });
   }

   if (!validator.validate(developerEmail) || !isValidURI(redirectUri)) {
       return res.status(400).json({ message: "Invalid Credentials" });
   }
 
   const clientId = appName + "." + uuidv4();
   const clientSecretPlain = uuidv4();
   const clientSecretHash = bcrypt.hashSync(clientSecretPlain, 10);
 
   const sql = `
     INSERT INTO client (clientId, clientSecret, appName, developerEmail, redirect_uri)
     VALUES (?, ?, ?, ?, ?)
   `;
 
   db.run(sql, [clientId, clientSecretHash, appName, developerEmail, redirectUri], async function (err) {
       if (err) {
           console.error("Erro ao registar aplicação:", err.message);
           return res.status(500).json({message: "Erro ao registar aplicação."});
       }

       console.log(process.env.EMAIL_PASSWORD);

       const transporter = nodemailer.createTransport({
           service: 'gmail', // You can replace this with another service like SendGrid or Mailgun
           auth: {
               user: 'oauthdevs@gmail.com',
               pass: process.env.EMAIL_PASSWORD    // Replace with your email password or an app-specific password
           },
           tls: {
               rejectUnauthorized: false
           }
       });

       const mailOptions = {
           from: 'oauthdevs@gmail.com',
           to: developerEmail,
           subject: 'Your OAuth Client Registration Details',
           text: `
            Dear Developer,
    
            Thank you for registering your application with our OAuth server. Below are your credentials:
    
            - Client ID: ${clientId}
            - Client Secret: ${clientSecretPlain}
    
            Best regards,
            OAuth Team
            `,
       };

       // Send the email
       try {
           await transporter.sendMail(mailOptions);
           console.log('Email sent successfully!');
       } catch (error) {
           console.error('Error sending email:', error);
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
                     <h2>Check you email account to get your OAuth2.0 credentials</h2>
                     </div>
                 </body>
               </html>
             `);


   });
}

const isValidURI = (uri) => {
    try {
        new URL(uri);
        return true;
    } catch (error) {
        return false;
    }
};


export{registerClient

}; 