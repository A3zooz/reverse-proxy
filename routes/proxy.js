import express from "express";
import httpProxy from "http-proxy";
import fs from "fs";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { authMiddleware, loginHandler, registerHandler } from "../middleware/auth.js";

const proxyRouter = express.Router();
const proxy = httpProxy.createProxyServer({});
const backends = JSON.parse(fs.readFileSync("backends.json"));

let currentBackendIndex = 0;
const weightedBackends = backends.flatMap(backend => Array(backend.weight).fill(backend));
function getNextBackend() {
    const backend = weightedBackends[currentBackendIndex];
    currentBackendIndex = (currentBackendIndex + 1) % weightedBackends.length;
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