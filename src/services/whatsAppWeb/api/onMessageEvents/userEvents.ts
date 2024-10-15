import type WAWebJS from "whatsapp-web.js";
import newcomerEvents from "./newcomerEvents";

export const userEvents = async (
	msg: WAWebJS.Message,
	client: WAWebJS.Client,
	chatId: string,
	spreadSheetId: string,
	newSession: boolean
) => {
	if (newSession) {
		client.sendMessage(
			chatId,
			`Shalom! ✨✨ \n\n` +
				`Silakan copy form di bawah dan diisi sesuai panduan. (copy form yang berada *di bawah* garis pembatas) \n` +
				`------------------------------------- \n\n` +
				`FORM UNI \n` +
				`Nama: \n` +
				`Gender: M/F \n` +
				`Tanggal Lahir: DD/MM/YYYY\n` +
				`Nomor WA: `
		);
		return;
	}

	if (msg.body.toLowerCase().startsWith("form uni")) {
		await newcomerEvents.addNewcomerExternal(spreadSheetId, msg);
		return;
	}
};
