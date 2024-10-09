import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { config } from "./../config/config";

const sqlite = new Database(config.DB_FILE_NAME, { create: true });
export const db = drizzle(sqlite);
