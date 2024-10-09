import dotenvSafe from "dotenv-safe";
import path from "path";

const cwd = process.cwd();
const root = (...args: string[]) => path.join(cwd, ...args);

dotenvSafe.config({
	path: root(".env"),
	allowEmptyValues: true,
	// sample: root(".env.example")
});

const {
	GOOGLE_PROJECT_ID,
	GOOGLE_PRIVATE_KEY_ID,
	GOOGLE_PRIVATE_KEY,
	GOOGLE_SERVICE_ACCOUNT_EMAIL,
	GOOGLE_CLIENT_ID,
	GOOGLE_AUTH_URI,
	GOOGLE_TOKEN_URI,
	GOOGLE_AUTH_PROVIDER,
	GOOGLE_CLIENT_CERT_URL,
	GOOGLE_SHEETS_ID,
	GOOGLE_SHEET_NAME,
	WHATSAPP_GROUP_NAME,
	ADMIN_WA_NUMBER,
	DB_FILE_NAME,
} = process.env;

export const config = {
	GOOGLE_PROJECT_ID,
	GOOGLE_PRIVATE_KEY_ID,
	GOOGLE_PRIVATE_KEY,
	GOOGLE_SERVICE_ACCOUNT_EMAIL,
	GOOGLE_CLIENT_ID,
	GOOGLE_AUTH_URI,
	GOOGLE_TOKEN_URI,
	GOOGLE_AUTH_PROVIDER,
	GOOGLE_CLIENT_CERT_URL,
	GOOGLE_SHEETS_ID,
	GOOGLE_SHEET_NAME,
	WHATSAPP_GROUP_NAME,
	ADMIN_WA_NUMBER: ADMIN_WA_NUMBER?.split(",") || ["6287884873293"],
	DB_FILE_NAME,
};
