import { client } from "../../client";
import { config } from "../../../../config/config";
import logger from "../../../../libraries/logger/logger";


const WA_GROUP_NAME = config.WHATSAPP_GROUP_NAME;

export const groupChatId = async ()=>{
    const chats = await client.getChats(); 
    const groupChat = chats.filter(ch => ch.name === WA_GROUP_NAME)[0];
    const chatId = groupChat.id._serialized;
    return chatId;
}

