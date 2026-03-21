import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool, db } from "@/db";

async function main() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
  await pool.end();
}

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});

