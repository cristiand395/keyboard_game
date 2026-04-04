import { db } from "./src/db";
import { users, accounts, sessions, verificationTokens } from "./src/db/schema";
import { sql } from "drizzle-orm";

async function clearUsers() {
  console.log("Limpiando tablas de usuarios...");
  await db.delete(sessions);
  await db.delete(accounts);
  await db.delete(verificationTokens);
  await db.delete(users);
  console.log("¡Hecho! Tablas de usuarios vaciadas.");
  process.exit(0);
}

clearUsers().catch(err => {
  console.error("Error al limpiar:", err);
  process.exit(1);
});
