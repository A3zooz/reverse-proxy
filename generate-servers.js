import express from "express";
import fs from "fs";

const ports = JSON.parse(fs.readFileSync("backends.json")).map(b => { return b.port; });

function generateServer(port) {
    const app = express();
    app.get('/', (req, res) => {
        res.status(200).send(`Hello from server on port ${port}`);
    });
    app.get('/health', (req, res) => {
        res.status(200).send('OK');
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

ports.forEach(port => generateServer(port));