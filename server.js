import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import fs from "fs";
import httpProxy from "http-proxy";

const app = express();
const PORT = process.env.PORT || 3001;
const backends = JSON.parse(fs.readFileSync("backends.json"));
const proxy = httpProxy.createProxyServer({});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25 // limit each IP to 25 requests per windowMs
})

app.use(limiter);
app.use(express.json());
app.use(morgan('combined'));

// round robin proxying
let currentBackendIndex = 0;
const weightedBackends = backends.flatMap(backend => Array(backend.weight).fill(backend));
function getNextBackend() {
    const backend = weightedBackends[currentBackendIndex];
    currentBackendIndex = (currentBackendIndex + 1) % weightedBackends.length;
    return backend;
}
app.all('/', (req, res) => {
    const target = getNextBackend();
    //log target
    console.log(`Proxying request to: ${target.url}`);

    proxy.web(req, res, {
        target: target.url,
        changeOrigin: true,
    }, (err) => {
        console.error(`Error proxying to ${target.url}:`, err);
        res.status(502).send('Bad Gateway');
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Load Balancer running on port ${PORT}`);
});