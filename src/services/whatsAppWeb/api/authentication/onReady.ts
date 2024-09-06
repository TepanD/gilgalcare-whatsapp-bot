import logger from "../../../../libraries/logger/logger";
import { client } from "../../client";
import { groupChatId } from "../groupChat/groupChat";

export const onReady = async () => {
	client.on("ready", async () => {
		logger.info("WAWeb client successfully logged in", { from: "onReady()" });

		const chatId = await groupChatId();

		client.sendMessage(
			chatId,
			"Whatsapp bot successfully started! 🚀🚀" +
				"\n\nSend *!help* to get more info"
		);
		logger.info(`newcomer-whatsapp-bot successfully started in ${chatId}`, {
			from: "onReady()",
		});
	});
};
