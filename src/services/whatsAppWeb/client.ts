import { Client, LocalAuth } from "whatsapp-web.js";
import { onReady } from "./api/authentication/onReady";
import { onAuthFailure } from "./api/authentication/onAuthFailure";
import { onQrCode } from "./api/authentication/onQrCode";

const SESSION_FILE_PATH = "./dist/wwebjs/.wwebjs_auth";

export const client = new Client({
	authStrategy: new LocalAuth({
		dataPath: SESSION_FILE_PATH,
	}),
	authTimeoutMs: 60 * 1000,
	puppeteer: {
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
		],
		handleSIGINT: false,
		headless: true,
		timeout: 120000, // Set the timeout to 2 minutes
	},
});

export const connectClient = async () => {
	client.initialize();

	//generate qr code for waweb connection
	onQrCode();

	//log ready when connection is established
	onReady();

	//log error when connection unsuccessful
	onAuthFailure();
};
