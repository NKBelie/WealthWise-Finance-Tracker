const app = require("./app");
const { env } = require("./config/env");
const { pool } = require("./config/db");

const server = app.listen(env.PORT, () => {
  console.log(`WealthWise API running on port ${env.PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing HTTP server and database pool.`);

  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
