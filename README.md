# Reverse Proxy with Load Balancing and Authentication

This project is a powerful and flexible reverse proxy server built with Node.js and Express. It provides load balancing, JWT-based authentication, rate limiting, and dynamic backend configuration. It's designed for scalability and easy deployment using Docker.

## ✨ Key Features

*   **🚀 High-Performance Reverse Proxy:** Efficiently forwards client requests to multiple backend services.
*   **⚖️ Weighted Load Balancing:** Distributes traffic across backend servers based on configurable weights, with health checks to ensure reliability.
*   **🔐 Secure Authentication:** Protects your services with JWT-based authentication and authorization.
*   **🛡️ Rate Limiting:** Prevents abuse and ensures service stability by limiting the number of requests from a single IP.
*   **✍️ Request Logging:** Detailed logging of incoming requests using `morgan` for monitoring and debugging.
*   **⚙️ Dynamic Configuration:** Easily add, remove, or modify backend servers by editing a simple JSON file (`backends.json`) without code changes.
*   **🐳 Dockerized:** Comes with `dockerfile` and `docker-compose` configurations for easy containerization and deployment.
*   **🚀 Process Management:** Includes PM2 scripts for easy process management in production environments.
*   **❤️ Health Checks:** Automatically performs health checks on backend services and routes traffic only to healthy instances.

## 🛠️ Technologies Used

*   **Backend:** Node.js, Express.js
*   **Proxy:** `http-proxy`
*   **Authentication:** `jsonwebtoken`, `bcryptjs`
*   **Database:** `sqlite3`
*   **Rate Limiting:** `express-rate-limit`
*   **Containerization:** Docker

## 📂 Project Structure

```
.
├── backends.json             # Configuration for backend servers
├── docker-compose.prod.yml   # Docker Compose for production
├── docker-compose.yml        # Docker Compose for development
├── dockerfile                # Dockerfile for building the image
├── generate-servers.js       # Script to generate mock backend servers
├── package.json
├── server.js                 # Main entry point for the reverse proxy
├── start.sh                  # Start script for Docker container
├── config/
│   └── db.js                 # Database configuration and initialization
├── data/
│   └── database.db           # SQLite database file (created on run)
├── middleware/
│   └── auth.js               # Authentication middleware and handlers
└── routes/
    ├── auth.js               # Authentication routes (register, login)
    └── proxy.js              # Proxying logic and load balancing
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/)
*   (Optional) [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/A3zooz/reverse-proxy.git
    cd reverse-proxy
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the root of the project and add a secret for signing JWTs.
    ```env
    JWT_SECRET=your_super_secret_jwt_key
    ```

### Running the Application

#### 1. Local Development

First, start the mock backend servers. This will create multiple server instances based on `backends.json`.
```bash
node generate-servers.js
```

In a new terminal, start the reverse proxy server:
```bash
npm run start:load-balancer
```
The reverse proxy will be running on `http://localhost:3001`.

#### 2. Using PM2 (for Production)

PM2 is a production process manager for Node.js applications. The included scripts make it easy to manage the application.

*   **Start all services:** `npm start` (This will use PM2 to start the servers)
*   **Check status:** `npm run status`
*   **View logs:** `npm run logs`
*   **Restart all services:** `npm run restart`
*   **Stop all services:** `npm run stopall`
*   **Delete all services from PM2:** `npm run delete`

#### 3. Using Docker

The project is fully configured to run with Docker.

1.  **Build and run with Docker Compose:**
    The easiest way to get started with Docker is using `docker-compose`.

    *   For a production-like environment:
        ```bash
        docker-compose -f docker-compose.prod.yml up --build -d
        ```
    *   For development (uses nodemon for hot-reloading):
        ```bash
        docker-compose up --build -d
        ```

2.  **View logs:**
    ```bash
    docker-compose logs -f
    ```

3.  **Stop the services:**
    ```bash
    docker-compose down
    ```

## 🔧 Configuration

### Backend Servers

You can configure the backend servers in `backends.json`. The load balancer will distribute traffic among these servers.

*   `name`: A friendly name for the server.
*   `url`: The full URL of the backend service.
*   `weight`: A number representing the proportion of traffic to send to this server. A higher weight means more traffic.
*   `healthPath`: The endpoint to hit for health checks.

Example `backends.json` entry:
```json
{
    "name": "backend-1",
    "protocol": "http",
    "host": "localhost",
    "port": 4001,
    "url": "http://localhost:4001",
    "weight": 1,
    "healthPath": "/health"
}
```

## 📡 API Endpoints

### Authentication

*   `POST /auth/register`
    Registers a new user.
    **Body:**
    ```json
    {
        "username": "testuser",
        "password": "password123",
        "role": "user"
    }
    ```

*   `POST /auth/login`
    Logs in a user and returns a JWT.
    **Body:**
    ```json
    {
        "username": "testuser",
        "password": "password123"
    }
    ```

### Proxied Services

*   `GET /api/*`
    This is the main endpoint that proxies requests to your backend services. You must include a valid JWT in the `Authorization` header.
    **Header:**
    ```
    Authorization: Bearer <your_jwt_token>
    ```

### Health Checks

*   `GET /health`
    An unauthenticated endpoint to check if the reverse proxy server is running. Returns `200 OK`.

## 📜 Scripts

*   `npm run start:load-balancer`: Starts the main reverse proxy server.
*   `npm run status`: Shows the status of applications managed by PM2.
*   `npm run logs`: Tails the logs of applications managed by PM2.
*   `npm run restart`: Restarts all applications managed by PM2.
*   `npm run delete`: Stops and removes all applications from PM2's list.
*   `npm run stopall`: Stops all applications managed by PM2.
