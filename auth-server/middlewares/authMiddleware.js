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

const tokenExchange = (req, res) => {
   const { code, client_id, client_secret } = req.body;

   // Verificar se o código existe
   const sql = "SELECT * FROM authorizationCode WHERE code = ?";
   db.get(sql, [code], (err, row) => {
      if (err) {
         console.error(err);
         return res.status(500).send("Erro ao buscar código de autorização.");
      }
      if (!row) {
         return res.status(400).send("Código de autorização inválido.");
      }

      // Verificar se o client_id e client_secret correspondem
      if (row.clientId !== client_id || row.clientSecret !== client_secret) {
         return res.status(400).send("Credenciais do cliente inválidas.");
      }

      // Gerar o token de acesso (access token)
      const accessToken = jwt.sign(
         { client_id: row.clientId, user_id: row.userId },
         process.env.JWT_SECRET,
         { expiresIn: "1h" }
      );

      // Retornar o token de acesso
      res.json({ access_token: accessToken });
   });
};



export default verifyToken;