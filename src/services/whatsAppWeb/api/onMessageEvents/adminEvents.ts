import type WAWebJS from "whatsapp-web.js";
import newcomerEvents from "./newcomerEvents";
import chatEvents from "./chatEvents";

export const adminEvents = async (
	msg: WAWebJS.Message,
	spreadSheetId: string
) => {
	if (msg.body.toLowerCase().startsWith("daftar")) {
		await newcomerEvents.addNewcomerInternal(spreadSheetId, msg);
		return;
	}

	if (msg.body.toLowerCase().startsWith("form uni")) {
		await newcomerEvents.addNewcomerExternal(spreadSheetId, msg);
		return;
	}

	//commands
	switch (msg.body.toLocaleLowerCase()) {
		case "!help":
			msg.reply(
				`✨✨ *LIST OF COMMANDS* ✨✨ \n\n` +
					`--------------------------------\n` +
					`GILGAL UNI CHATBOT (DEMO)\n` +
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
					`FORM UNI \n` +
					`Nama: \n` +
					`Gender: M/F \n` +
					`Tanggal Lahir: DD/MM/YYYY\n` +
					`Nomor WA: `
			);
			return;

		case "!clear":
			await chatEvents.clearMessages(msg);
			return;

		default:
			return;
	}
};
