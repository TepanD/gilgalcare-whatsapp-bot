import { client } from "../services/whatsAppWeb/client";
import logger from "../libraries/logger/logger";
import { groupChatId } from "../services/whatsAppWeb/api/groupChat/groupChat";

const exitHandler = async () => {
	const chatId = await groupChatId();
	await client.sendMessage(
		chatId,
		"Whatsapp bot shutting down! Thank you. 👋🥹"
	);
	logger.info("Application shutting down.", { from: "app.exitHandler()" });
};

const shutdownTask = async () => {
	try {
		exitHandler();
		setTimeout(() => {
			process.exit(0);
		}, 2000);
	} catch (error: any) {
		logger.error("Error during shutdown", {
			errorMessage: error.message,
			from: "app.app()",
		});
		process.exit(1);
	}
};

export const onShutDown = () => {
	// keep process running when ctrl+c is pressed
	process.stdin.resume();

	// nodejs process POSIX events
	const signals = ["SIGINT", "SIGBREAK", "SIGTERM"];
	signals.forEach((signal) => {
		process.on(signal.toString(), () => {
			shutdownTask();
		});
	});

	// pm2 stop process event
	process.on("message", (msg: string) => {
		shutdownTask();
	});
};
