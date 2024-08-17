import { config } from "../../../../config/config";
import { client } from "../../client";
import chatEvents from "./chatEvents";
import newcomerEvents from "./newcomerEvents";

const SHEET_ID = config.GOOGLE_SHEETS_ID ?? "";
const GROUP_NAME= config.WHATSAPP_GROUP_NAME ?? "";


export const onMessage = async () => {
  client.on("message_create", async (msg) => {
    //get chat data.
    const chatData = await msg.getChat();

    //validate chat is group && group name
    if(chatData.isGroup && chatData.name === GROUP_NAME){
      const spreadSheetId = SHEET_ID;

      if(msg.body.toLowerCase().startsWith("daftar")){
        await newcomerEvents.addNewcomerInternal(spreadSheetId, msg);
        return;
      }

      if(msg.body.toLowerCase().startsWith("test")){
        await newcomerEvents.addNewcomerExternal(spreadSheetId, msg);
        return;
      }
      
      switch (msg.body) {
        case "!help":
          msg.reply(
            `✨✨*LIST OF COMMANDS*✨✨ \n\n`+
            `--------------------------------\n` +
            `📌LIST OF FORMS\n\n`+
            `  ✳️  !form-internal\n`+
            `  ✳️  !form-external\n\n`+
            `--------------------------------\n` +
            `📌LIST OF CHAT MANAGEMENT\n\n`+
            `  ✳️  !clear\n`
          );
          return;

        case "!form-internal":
          msg.reply(
            `*FORMAT PENDAFTARAN* (copy semua yang di bawah): \n\n`+   
            `daftar #nama #tanggal lahir (dd/MM/YYYY) #tempat lahir`);
          return;
        
        case "!form-external":
          msg.reply(
            `*FORMAT PENDAFTARAN* (copy semua yang di bawah): \n\n`+
            `test\n`+
            `Nama: \n`+
            `Tanggal Lahir: DD/MM/YYYY\n`+
            `Alamat: \n` 
          );
          return;

        case "!clear":
          await chatEvents.clearMessages(msg);
          return;

        default:
          return;
      }
    }
  });
};
