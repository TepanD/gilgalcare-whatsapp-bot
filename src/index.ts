import dotenvSafe from "dotenv-safe";

dotenvSafe.config({
	path:
		process.env.NODE_ENV === "production"
			? ".env.production"
			: ".env.development",
});

import { app } from "./app";

app();
