import { config } from "../../../../config/config";
import { client } from "../../client";
import chatEvents from "./chatEvents";
import newcomerEvents from "./newcomerEvents";

const SHEET_ID = config.GOOGLE_SHEETS_ID ?? "";

export const onMessage = async () => {
  client.on("message_create", async (msg) => {
    const chatData = await msg.getChat();
    if(chatData.isGroup && chatData.name === "testing doank"){
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
            `*FORMAT PENDAFTARAN*: \n\n`+   
            `daftar #nama #tanggal lahir (dd/MM/YYYY) #tempat lahir`);
          return;
        
        case "!form-external":
          msg.reply(
            `*FORMAT PENDAFTARAN*: \n\n`+
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
