import { client } from "../../client";

export const onReady = async () => {
  client.on("ready", async () => {
    console.log("WAWeb client successfully logged in!");

    const chats = await client.getChats(); 
    const groupChat = chats.filter(ch => ch.name ==="testing doank")[0];
    const chatId = groupChat.id._serialized;

    client.sendMessage(chatId, "Whatsapp bot successfully started! 👋🥹🚀🚀"); 
  });
};
