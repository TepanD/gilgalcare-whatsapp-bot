import { validateSession } from "./../../../../services/session";
import { config } from "../../../../config/config";
import { client } from "../../client";
import { adminEvents } from "./adminEvents";
import { userEvents } from "./userEvents";
import logger from "../../../../libraries/logger/logger";

const SHEET_ID = config.GOOGLE_SHEETS_ID ?? "";
let IS_ADMIN = false;
const ENV = process.env.NODE_ENV;

export const onMessage = async () => {
	client.on("message_create", async (msg) => {
		const adminNumbers = config.ADMIN_WA_NUMBER;
		logger.info("admin:" + adminNumbers);

		//get chat data.
		const chatData = await msg.getChat();
		const chatId = chatData.id._serialized;
		const senderNumber = (await msg.getContact()).number;

		//validate role
		adminNumbers.forEach((element) => {
			if (element.trim() === senderNumber.trim()) {
				IS_ADMIN = true;
				return false;
			}
		});

		logger.info(senderNumber + " is admin: " + IS_ADMIN);

		const newSession: boolean = await validateSession(senderNumber, chatId);
		const spreadSheetId = SHEET_ID;
		const groupName = config.WHATSAPP_GROUP_NAME ?? "";

		//for dev env
		if (ENV === "development") {
			if (chatData.isGroup && chatData.name === groupName && IS_ADMIN) {
				await adminEvents(msg, spreadSheetId);
				return;
			} else if (chatData.isGroup && chatData.name === groupName && !IS_ADMIN) {
				await userEvents(msg, client, chatId, spreadSheetId, newSession);
				return;
			}
			return;
		}

		if (chatData.isGroup && chatData.name !== groupName) return;

		if (IS_ADMIN) {
			await adminEvents(msg, spreadSheetId);
			return;
		} else if (!IS_ADMIN) {
			await userEvents(msg, client, chatId, spreadSheetId, newSession);
			return;
		}
	});
};
