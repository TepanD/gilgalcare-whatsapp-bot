import logger from "../../../../libraries/logger/logger";
import { client } from "../../client";
import { groupChatId } from "../groupChat/groupChat";

export const onReady = async () => {
  client.on("ready", async () => {
    logger.info("WAWeb client successfully logged in");

    const chatId = await groupChatId();

    client.sendMessage(chatId, "Whatsapp bot successfully started! 🚀🚀"); 
    logger.info(`newcomer-whatsapp-bot successfully started in ${chatId}`);
  });
};
