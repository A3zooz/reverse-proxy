# Use the official Node.js LTS image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies for SQLite and native modules
RUN apk add --no-cache \
    sqlite \
    python3 \
    make \
    g++ \
    sqlite-dev

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy the application source code
COPY . .

# Create data directory for SQLite database if it doesn't exist
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/database.db

# Expose the main reverse proxy port
EXPOSE 3001

# Expose backend server ports (based on your backends.json structure)
# Note: You may need to adjust these based on your actual backend ports
EXPOSE 4001-4010

# Copy and set up the startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Health check to ensure the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Set the default command to run the startup script
CMD ["/app/start.sh"]
