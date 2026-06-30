# WealthWise API

Smart personal finance tracker REST API for Codveda Full-Stack Development Internship Level 1 Task 2.

## Project Architecture

```text
src/
|-- config/        # environment and PostgreSQL pool setup
|-- controllers/   # request and response logic
|-- middleware/    # validation, 404, and centralized error handling
|-- models/        # PostgreSQL query layer
|-- routes/        # REST endpoint definitions
|-- utils/         # reusable helpers
|-- validators/    # Joi request schemas
|-- app.js         # Express app configuration
`-- server.js      # HTTP server startup
```

Request flow:

```text
Postman -> routes -> validation middleware -> controllers -> models -> PostgreSQL
```

## Installation Commands

```bash
npm install
cp .env.example .env
npm run dev
```

Update `.env` with your PostgreSQL username and password before testing database endpoints.

## PostgreSQL Setup

Create the database:

```bash
psql -U postgres -f database/create_database.sql
```

Create the tables:

```bash
psql -U postgres -d wealthwise_db -f database/schema.sql
```

## Base URL

```text
http://localhost:5000
```

Full endpoint documentation is in `docs/API_DOCUMENTATION.md`.

Postman examples are in `postman/WealthWise-Level1-Task2.postman_collection.json`.
