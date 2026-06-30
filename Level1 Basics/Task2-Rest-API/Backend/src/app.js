const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const userRoutes = require("./routes/user.routes");
const incomeRoutes = require("./routes/income.routes");
const expenseRoutes = require("./routes/expense.routes");
const notFoundHandler = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const corsOptions = {
  origin:
    env.CORS_ORIGIN === "*"
      ? "*"
      : env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "WealthWise API is running",
    resources: {
      users: "/api/users",
      income: "/api/income",
      expenses: "/api/expenses"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "wealthwise-api",
    environment: env.NODE_ENV
  });
});

app.use("/api/users", userRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
