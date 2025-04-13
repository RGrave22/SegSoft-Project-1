import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js'; 
import { db } from './config/dbconnect.js';

const app = express();
const port = process.env.PORT || 9000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use("/", router);

app.listen(port, () => {
  console.log(`Authorization Server running at http://localhost:${port}`);
});
