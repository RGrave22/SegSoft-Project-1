import jwt from "jsonwebtoken";

const verifyToken = (req,res,next) =>{
   const authHeader = req.headers.authorization;

   if(authHeader && authHeader.startsWIth("Bearer")){
      const token = authHeader.split(" ")[1];
      
      if(!token){
         return res.status(401).json({message: "No token providad"});
      }

      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;
         console.log("The user is", req.user);
         next();
      } catch (error) {
         return res.status(400).json({message:"Invalid Token"});
      }
   }else {
      return res.status(401).json({message:"Auth header missing or malformed"});
   }
}



export default verifyToken;