import {db} from "../config/dbconnect.js";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";


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
         return res.status(201).json({
            id:this.lastId,
            email,
         });

      });
   
   } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Server error doing the register"});
   }
}

const login = async (req, res) =>{

   const {email, password} = req.body;

   
   if(!email || !password){
      return res.status(401).json({error: "Missing email or password"});
   }

   const sql = "Select * FROM user Where email = ?";
   db.get(sql,[email], async(err,row)=>{
      if(err){
         console.error(err);
         return res.status(401).json({error: "Database Error"});
      }
      if(!row){
         return res.status(401).json({error:"Invalid Credentials"});
      }

      const match = await bcrypt.compare(password, row.password);

      if(!match){
         return res.status(401).json({error:"Invalid Crendentials"});
      }

      

      const token = jwt.sign(
         {email: row.email},
         process.env.JWT_SECRET,
         {expiresIn: process.env.EXPIRES_IN_JWT || "1h"}
      );
      console.log(token);

      return res.json({
         message:"Login Successful",
         token,
      });
   });
}

export{register, login};