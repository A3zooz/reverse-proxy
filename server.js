import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { authMiddleware } from "./middleware/auth.js";
import proxyRouter from "./routes/proxy.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25 // limit each IP to 25 requests per windowMs
})

app.use(limiter);
app.use(express.json());
app.use(morgan('combined'));

// Use routes
app.use('/api', authMiddleware, proxyRouter);
app.use('/auth', authRouter);

// Unauthenticated health endpoint for container/platform health checks
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});




app.listen(PORT, () => {
    console.log(`Load Balancer running on port ${PORT}`);
});