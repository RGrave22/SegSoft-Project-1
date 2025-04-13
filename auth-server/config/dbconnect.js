import sqlite3Module from 'sqlite3';
const sqlite3 = sqlite3Module.verbose();

import{fileURLToPath} from 'url';
import path from 'path';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const dbPath = path.resolve(_dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath,(err) =>{
   if (err) {
      console.error("Error connecting to SQLite db", err.message);
   } else {
      console.log("Connected to the db");
   }
   
});

const init = db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS client (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientId TEXT NOT NULL,
    clientSecret TEXT NOT NULL,
    appName TEXT NOT NULL,
    developerEmail TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS authorizationCode (
  code TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  userId TEXT NOT NULL,
  createdAt DATETIME NOT NULL,
  expiresIn INTEGER DEFAULT 600)`); 
}
);


db.all("SELECT * FROM user", (err, rows) => {
   if (err) {
     console.error("Erro ao obter dados", err.message);
   } else {
     console.log(rows); 
   }
 });

 db.all("SELECT * FROM client", (err, rows) => {
   if (err) {
     console.error("Erro ao obter dados", err.message);
   } else {
     console.log(rows); 
   }
 });

 db.all("SELECT * FROM authorizationCode", (err, rows) => {
   if (err) {
     console.error("Erro ao obter dados", err.message);
   } else {
     console.log(rows); 
   }
 });




export {db,init};