import express from "express";
import httpProxy from "http-proxy";
import fs from "fs";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { authMiddleware, loginHandler, registerHandler } from "../middleware/auth.js";
import axios from "axios";

const proxyRouter = express.Router();
const proxy = httpProxy.createProxyServer({});
const backends = JSON.parse(fs.readFileSync("backends.json"));

async function checkHealth(backend) {
    try {
        const res = await axios.get(`${backend.url}${backend.healthPath}`, { timeout: 5000 });
        return res.status === 200;
    } catch (err) {
        console.error(`Health check failed for ${backend.url}:`, err);
        return false;
    }
}

let currentBackendIndex = 0;
const weightedBackends = backends.flatMap(backend => Array(backend.weight).fill(backend));
const healthyBackends = weightedBackends.filter(backend => checkHealth(backend));
function getNextBackend() {
    const backend = healthyBackends[currentBackendIndex];
    currentBackendIndex = (currentBackendIndex + 1) % healthyBackends.length;
    return backend;
}


proxyRouter.all('/', (req, res) => {
    const target = getNextBackend();
    console.log(`Proxying request to: ${target.url}`);
    proxy.web(req, res, {
        target: target.url,
        changeOrigin: true,
    }, (err) => {
        console.error(`Error proxying to ${target.url}:`, err);
        res.status(502).send('Bad Gateway');
    });
});

// Health check
proxyRouter.get('/health', (req, res) => {
    res.status(200).send('OK');
});

export default proxyRouter;