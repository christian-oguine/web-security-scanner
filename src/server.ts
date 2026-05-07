import app from "./app.js";
import { testDatabaseConnection } from "./config/database.js";

const PORT = process.env.PORT ?? 5000;

async function start() {
  await testDatabaseConnection();
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
}

start();