#!/bin/sh

# Function to handle graceful shutdown
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $PROXY_PID 2>/dev/null
    exit 0
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGTERM SIGINT

# Ensure database directory exists
mkdir -p /app/data

echo "Starting backend servers..."
node generate-servers.js &
BACKEND_PID=$!

# Wait for backend servers to initialize
echo "Waiting for backend servers to start..."
sleep 10

# Check if backend servers are running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend servers failed to start"
    exit 1
fi

echo "Starting reverse proxy server..."
node server.js &
PROXY_PID=$!

# Wait for proxy server to initialize
sleep 5

# Check if proxy server is running
if ! kill -0 $PROXY_PID 2>/dev/null; then
    echo "Proxy server failed to start"
    cleanup
    exit 1
fi

echo "All services started successfully"

# Wait for either process to exit
wait $PROXY_PID
