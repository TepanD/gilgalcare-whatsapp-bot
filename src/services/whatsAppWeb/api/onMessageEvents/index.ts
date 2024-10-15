import { validateSession } from "./../../../../services/session";
import { config } from "../../../../config/config";
import { client } from "../../client";
import { adminEvents } from "./adminEvents";
import { userEvents } from "./userEvents";

const SHEET_ID = config.GOOGLE_SHEETS_ID ?? "";
// const GROUP_NAME = config.WHATSAPP_GROUP_NAME ?? "";
let IS_ADMIN = false;

export const onMessage = async () => {
	client.on("message_create", async (msg) => {
		const adminNumbers = config.ADMIN_WA_NUMBER;
		//get chat data.
		const chatData = await msg.getChat();
		const chatId = chatData.id._serialized;
		const senderNumber = (await msg.getContact()).number;

		//validate role
		adminNumbers.forEach((element) => {
			if (element === senderNumber) {
				IS_ADMIN = true;
				return false;
			} else {
				IS_ADMIN = false;
			}
		});

		const newSession: boolean = await validateSession(senderNumber, chatId);
		const spreadSheetId = SHEET_ID;

		//to validate chat is group && group name use:
		//chatData.isGroup && chatData.name === GROUP_NAME &&

		if (IS_ADMIN) {
			await adminEvents(msg, spreadSheetId);
			return;
		} else if (!IS_ADMIN) {
			await userEvents(msg, client, chatId, spreadSheetId, newSession);
			return;
		}
	});
};
