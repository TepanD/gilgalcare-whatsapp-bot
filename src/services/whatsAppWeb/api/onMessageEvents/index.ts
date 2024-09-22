// import logger from "../../../../libraries/logger/logger";
import { config } from "../../../../config/config";
import { client } from "../../client";
import chatEvents from "./chatEvents";
import newcomerEvents from "./newcomerEvents";

const SHEET_ID = config.GOOGLE_SHEETS_ID ?? "";
const GROUP_NAME = config.WHATSAPP_GROUP_NAME ?? "";

export const onMessage = async () => {
	client.on("message_create", async (msg) => {
		//get chat data.
		const chatData = await msg.getChat();
		// const contact = await msg.getContact();

		// logger.debug(contact.number.toString());

		//validate chat is group && group name
		if (chatData.isGroup && chatData.name === GROUP_NAME) {
			const spreadSheetId = SHEET_ID;

			if (msg.body.toLowerCase().startsWith("daftar")) {
				await newcomerEvents.addNewcomerInternal(spreadSheetId, msg);
				return;
			}

			if (msg.body.toLowerCase().startsWith("nama:")) {
				await newcomerEvents.addNewcomerExternal(spreadSheetId, msg);
				return;
			}

			//commands
			switch (msg.body.toLocaleLowerCase()) {
				case "!help":
					msg.reply(
						`✨✨ *LIST OF COMMANDS* ✨✨ \n\n` +
							`--------------------------------\n` +
							`GILGAL UNI CHATBOT DEMO\n` +
							`--------------------------------\n` +
							`📌LIST OF FORMS\n\n` +
							`  ✳️  !form-internal\n` +
							`  ✳️  !form-external\n\n` +
							`--------------------------------\n` +
							`📌LIST OF CHAT MANAGEMENT\n\n` +
							`  ✳️  !clear\n`
					);
					return;

				case "!form-internal":
					msg.reply(
						`*FORMAT PENDAFTARAN* (copy semua yang di bawah): \n\n` +
							`daftar #nama #(M/F) #umur(dalam tahun) #nomorWA #familyCell`
					);
					return;

				case "!form-external":
					msg.reply(
						`*FORMAT PENDAFTARAN* (copy semua yang di bawah): \n\n` +
							`Nama: \n` +
							`Gender: M/F \n` +
							`Tanggal Lahir: DD/MM/YYYY\n` +
							`Nomor WA: \n`
					);
					return;

				case "!clear":
					await chatEvents.clearMessages(msg);
					return;

				default:
					// msg.reply(`welcome to GILGAL WA CHATBOT DEMO`);
					return;
			}
		}
	});
};
