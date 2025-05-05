# B2C E-commerce Platform

![Project Logo](#) <!-- Placeholder for project logo/image -->

[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?logo=docker)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?logo=prisma)](https://www.prisma.io/)

A modern B2C e-commerce platform built with a **TypeScript** backend (Express, Prisma, PostgreSQL, Redis) and a **Next.js** frontend. Features include user authentication, product management, cart, checkout, order processing, analytics, and real-time chat via Socket.IO, WebRTC. The application is fully Dockerized for easy setup and development.

[Live Demo](#) <!-- Placeholder for live demo link -->  
[Demo Video](#) <!-- Placeholder for demo video -->

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Docker Setup](#docker-setup)
  - [Non-Docker Setup](#non-docker-setup)
- [Running the Application](#running-the-application)
- [Seeding the Database](#seeding-the-database)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Register, login, manage profiles, and roles (User, Admin, Superadmin).
- **Product Catalog**: Browse products with categories, attributes, and reviews.
- **Cart & Checkout**: Add items to cart, manage quantities, and complete checkout with payment integration.
- **Order Processing**: Track orders with statuses (Pending, Shipped, Delivered, etc.).
- **Analytics**: Insights on sales, user interactions, and product performance.
- **Real-time Chat**: Customer support via Socket.IO-based chat.
- **Secure API**: REST and GraphQL endpoints with JWT authentication, CORS, and input sanitization.
- **Database Seeding**: Pre-populate the database with test data for development.

<!-- Add screenshots or GIFs here -->
![App Screenshot](#) <!-- Placeholder for screenshot -->

## Tech Stack

**Backend**:
- Node.js v22
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Socket.IO
- Winston (logging)
- Cloudinary (image storage)
- Stripe (payment processing)

**Frontend**:
- Next.js
- TypeScript
- Tailwind CSS (assumed, adjust if different)

**Infrastructure**:
- Docker & Docker Compose
- WSL2 (development environment)

## Project Structure

```
b2c-ecommerce/
├── client/                   # Next.js frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── ...
├── server/                   # Express backend
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seeds/seed.ts
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── modules/        # Feature modules (user, product, order, etc.)
│   │   ├── routes/         # API routes (v1, v2)
│   │   ├── graphql/        # GraphQL schemas and resolvers
│   │   └── ...
│   └── ...
├── docker-compose.yml        # Docker services (db, redis, server, client)
└── README.md
```

## Prerequisites

- **Node.js** v22 or higher ([Download](https://nodejs.org/))
- **npm** v10 or higher
- **Docker** and **Docker Compose** (for Docker setup) ([Download](https://www.docker.com/))
- **PostgreSQL** v15 and **Redis** v7 (for non-Docker setup)
- **WSL2** (optional, recommended for Windows users)

For WSL2 users, ensure Docker Desktop is configured with WSL2 integration and `localhostForwarding=true` in `~/.wslconfig`.

## Installation

### Docker Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/b2c-ecommerce.git
   cd b2c-ecommerce
   ```

2. **Install Dependencies**:
   - For backend:
     ```bash
     cd server
     npm install
     ```
   - For frontend:
     ```bash
     cd client
     npm install
     ```

3. **Set Up Environment Variables**:
   - Copy the example `.env` files:
     ```bash
     cp server/.env.example server/.env
     cp client/.env.example client/.env.local
     ```
   - Update `server/.env` with your credentials (e.g., `SESSION_SECRET`, `COOKIE_SECRET`).

4. **Build and Start Services**:
   ```bash
   docker compose up --build
   ```
   - This starts `db` (PostgreSQL), `redis`, `server` (backend), and `client` (frontend).

5. **Run Prisma Migrations**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

### Non-Docker Setup

1. **Install PostgreSQL and Redis**:
   - On Ubuntu (WSL2):
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib redis-server
     ```
   - Start services:
     ```bash
     sudo service postgresql start
     sudo service redis-server start
     ```

2. **Configure PostgreSQL**:
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE USER abdelrahman WITH PASSWORD 'Body,601543122016';
   CREATE DATABASE b2c_ecommerce;
   GRANT ALL PRIVILEGES ON DATABASE b2c_ecommerce TO abdelrahman;
   \q
   ```

3. **Clone and Install Dependencies**:
   ```bash
   git clone https://github.com/your-username/b2c-ecommerce.git
   cd b2c-ecommerce
   cd server && npm install
   cd ../client && npm install
   ```

4. **Set Up Environment Variables**:
   - Copy `.env` files as above.
   - Ensure `server/.env` has:
     ```
     DATABASE_URL=postgresql://abdelrahman:Body,601543122016@localhost:5432/b2c_ecommerce
     REDIS_HOST=localhost
     REDIS_PORT=6379
     PORT=5000
     NODE_ENV=development
     SESSION_SECRET=your_session_secret
     COOKIE_SECRET=your_cookie_secret
     ```
   - Ensure `client/.env.local` has:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000
     ```

5. **Run Prisma Migrations**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

## Running the Application

### Docker
- Start all services:
  ```bash
  docker compose up
  ```
- Access:
  - Frontend: `http://localhost:3000`
  - Backend API: `http://localhost:5000/api/v1`
  - Swagger Docs: `http://localhost:5000/api-docs`
  - GraphQL: `http://localhost:5000/api/v1/graphql`

### Non-Docker
1. Start PostgreSQL and Redis (if not already running).
2. Start the backend:
   ```bash
   cd server
   npm run dev
   ```
3. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```
- Access URLs as above.

## Seeding the Database

Populate the database with test data (10 users, 5 categories, 50 products, 20 orders):

1. Ensure the database is running (`docker compose up -d db` or local PostgreSQL).
2. Run the seeding script:
   ```bash
   cd server
   npm run seed
   ```
3. Verify data:
   ```bash
   psql -h localhost -p 5432 -U abdelrahman -d b2c_ecommerce
   SELECT * FROM "User" LIMIT 5;
   SELECT * FROM "Product" LIMIT 5;
   SELECT * FROM "Order" LIMIT 5;
   ```

## API Documentation

Explore the REST API via Swagger UI:
- URL: `http://localhost:5000/api-docs`
- Includes endpoints for `/api/v1/users`, `/api/v1/auth`, `/api/v1/products`, etc.

GraphQL API is available at:
- URL: `http://localhost:5000/api/v1/graphql`

## Testing

<!-- Placeholder for testing instructions -->
Tests are not yet implemented. To contribute tests:
1. Add test files in `server/tests/` or `client/tests/`.
2. Use Jest or your preferred testing framework.
3. Update this section with setup instructions.

## Deployment

<!-- Placeholder for deployment instructions -->
To deploy the application:
1. **Backend**: Host on a platform like AWS ECS, Heroku, or Render.
2. **Frontend**: Deploy on Vercel, Netlify, or AWS Amplify.
3. **Database**: Use a managed PostgreSQL/Redis provider (e.g., AWS RDS, Redis Labs).
4. Update environment variables for production.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please follow the [Code of Conduct](#) and report issues via [GitHub Issues](#).

## License

This project is licensed under the MIT License. See the [LICENSE](#) file for details.

---

<!-- Placeholder for additional images or videos -->
![Demo GIF](#) <!-- Placeholder for demo GIF -->