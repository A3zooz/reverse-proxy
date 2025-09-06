import sqlite3 from "sqlite3";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const dbPath = process.env.DB_PATH || path.resolve(process.cwd(), 'data', 'database.db');
const db = new sqlite3.Database(dbPath);


db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`, (err) => {
    if (err) {
        console.error("Error creating users table:", err);
    } else {
        console.log("Users table ensured.");
    }
});

export default db;
