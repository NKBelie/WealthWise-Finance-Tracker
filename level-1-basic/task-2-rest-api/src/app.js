const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const userRoutes = require("./routes/user.routes");
const incomeRoutes = require("./routes/income.routes");
const expenseRoutes = require("./routes/expense.routes");
const budgetRoutes = require("./routes/budget.routes");
const notFoundHandler = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// ===============================================
// Security and CORS Configuration
// ===============================================
const corsOptions = {
  origin:
    env.CORS_ORIGIN === "*"
      ? "*"
      : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors(corsOptions));

// ===============================================
// Middleware Configuration
// ===============================================
app.use(express.json({ limit: "10mb" })); // Increased for file uploads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ===============================================
// API Information and Health Endpoints
// ===============================================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "WealthWise Finance Tracker API",
    version: "1.0.0",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      income: "/api/income",
      expenses: "/api/expenses",
      budgets: "/api/budgets"
    },
    documentation: {
      postman: "/docs/postman-collection",
      swagger: "/docs/api" // Future implementation
    }
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "wealthwise-api",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: "1.0.0"
  });
});

// API Info endpoint
app.get("/api/info", (req, res) => {
  res.status(200).json({
    status: "success",
    api: {
      name: "WealthWise Finance Tracker API",
      version: "1.0.0",
      description: "Comprehensive personal finance management REST API",
      level: "Level 1 - Task 2: Enhanced REST API Implementation"
    },
    features: {
      users: "Complete user management with CRUD operations",
      income: "Income tracking with categorization and recurring support",
      expenses: "Expense management with receipts and categorization",
      budgets: "Budget planning, monitoring, and alerts",
      categories: "Dynamic category management system",
      validation: "Comprehensive input validation with Joi",
      security: "Password hashing, input sanitization, CORS protection"
    },
    endpoints: {
      users: {
        base: "/api/users",
        methods: ["GET", "POST", "PUT", "DELETE"],
        features: ["CRUD operations", "Password hashing", "Email validation"]
      },
      income: {
        base: "/api/income",
        methods: ["GET", "POST", "PUT", "DELETE"],
        features: ["Categorization", "Recurring income", "Date filtering"]
      },
      expenses: {
        base: "/api/expenses", 
        methods: ["GET", "POST", "PUT", "DELETE"],
        features: ["Receipt uploads", "Categories", "Payment methods", "Location tracking"]
      },
      budgets: {
        base: "/api/budgets",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        features: ["Progress tracking", "Alerts", "Multi-period support", "Expense sync"]
      }
    }
  });
});

// ===============================================
// API Routes
// ===============================================
app.use("/api/users", userRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);

// ===============================================
// Documentation Routes (Future Implementation)
// ===============================================
app.get("/docs/postman-collection", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Postman collection endpoint",
    download_url: "/postman/WealthWise-Level1-Task2.postman_collection.json",
    instructions: "Import this collection into Postman to test all API endpoints"
  });
});

// ===============================================
// Statistics and Monitoring Endpoints
// ===============================================
app.get("/api/stats", async (req, res) => {
  try {
    // This would normally require database queries
    // For now, returning static information
    res.status(200).json({
      status: "success",
      statistics: {
        endpoints: {
          users: 5,
          income: 5,
          expenses: 5,
          budgets: 12,
          total: 27
        },
        features: {
          crud_operations: true,
          data_validation: true,
          error_handling: true,
          security_middleware: true,
          cors_support: true,
          logging: true
        },
        implementation_level: "Level 1 - Task 2 Complete"
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve statistics"
    });
  }
});

// ===============================================
// Error Handling Middleware
// ===============================================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;