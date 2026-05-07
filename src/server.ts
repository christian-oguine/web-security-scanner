import app from "./app.js";
import { testDatabaseConnection } from "./config/database.js";

const PORT = process.env.PORT ?? 5000;

async function start(): Promise<void> {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});