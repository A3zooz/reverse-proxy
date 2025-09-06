# Docker Setup for Reverse Proxy

## Building and Running with Docker

### Option 1: Using Docker directly

1. **Build the image:**
   ```bash
   docker build -t reverse-proxy .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name reverse-proxy \
     -p 3001:3001 \
     -p 4001-4010:4001-4010 \
     -e JWT_SECRET=your-jwt-secret-here \
     -e NODE_ENV=production \
     -v reverse-proxy-data:/app/data \
     reverse-proxy
   ```

### Option 2: Using Docker Compose

1. **Start the services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **View logs:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

3. **Stop the services:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

## Environment Variables

- `PORT`: Main reverse proxy port (default: 3001)
- `NODE_ENV`: Node environment (default: production)
- `DB_PATH`: SQLite database path (default: /app/data/database.db)
- `JWT_SECRET`: Secret key for JWT tokens (required for production)

## Volume Mounts

- `/app/data`: SQLite database storage (persistent)

## Exposed Ports

- `3001`: Main reverse proxy server
- `4001-4010`: Backend servers (adjust range based on your backends.json)

## Health Check

The container includes a health check endpoint at `/health` that verifies the service is running properly.

## Database

The SQLite database is automatically initialized on first run and stored in the persistent volume at `/app/data/database.db`.
