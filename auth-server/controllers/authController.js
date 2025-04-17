import {db} from "../config/dbconnect.js";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";



const register = async(req,res) => {
   const {email, password} = req.body;

   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'Insert into user (email,password) values (?,?)';
      db.run(sql,[email,hashedPassword], function (err){
         if(err){
            console.error(err);
            return res.status(400).json({error:err.message});
         }
         return res.redirect(`/login`);

      });
   
   } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Server error doing the register"});
   }
}

const login = async (req, res) => {
   const { email, password,} = req.body;
   const { client_id, redirect_uri } = req.session;
 
   console.log(client_id);
   console.log(redirect_uri);

   if (!email || !password || !client_id || !redirect_uri) {
     return res.status(401).json({ error: "Missing required fields (email, password, client_id, redirect_uri)" });
   }
 
   const sql = "SELECT * FROM user WHERE email = ?";
   db.get(sql, [email], async (err, row) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ error: "Database Error" });
      }
      if (!row) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
 
      const match = await bcrypt.compare(password, row.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
 
      req.session.user = {
        email: row.email,
      };

      return res.redirect(`/consent`);
   });
 };
 


export{register, login};