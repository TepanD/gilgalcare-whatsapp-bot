import dotenvSafe from "dotenv-safe";

dotenvSafe.config({
	path:
		process.env.NODE_ENV === "production"
			? ".env.production"
			: ".env.development",
});

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_FILE_NAME!,
	},
});
