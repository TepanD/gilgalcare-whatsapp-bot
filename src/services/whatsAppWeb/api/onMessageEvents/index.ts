import { config } from "../../../../config/config";
import { client } from "../../client";
import chatEvents from "./chatEvents";
import newcomerEvents from "./newcomerEvents";
import { sessions } from "./../../../../db/schema";
import { db } from "./../../../../db/index";
import { eq, sql, count } from "drizzle-orm";

const SHEET_ID = config.GOOGLE_SHEETS_ID ?? "";
const GROUP_NAME = config.WHATSAPP_GROUP_NAME ?? "";
let IS_ADMIN = false;

export const onMessage = async () => {
	client.on("message_create", async (msg) => {
		//get chat data.
		const chatData = await msg.getChat();
		const senderNumber = (await msg.getContact()).number;
		const adminNumbers = config.ADMIN_WA_NUMBER;

		adminNumbers.forEach((element) => {
			if (element === senderNumber) {
				IS_ADMIN = true;
				return false;
			} else {
				IS_ADMIN = false;
			}
		});
		//validate chat is group && group name
		if (chatData.isGroup && chatData.name === GROUP_NAME && IS_ADMIN) {
			const newSession: Boolean = await validateSessionNew(
				senderNumber,
				chatData.id._serialized
			);
			const spreadSheetId = SHEET_ID;

			if (newSession) {
				msg.reply(
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
		} else if (chatData.isGroup && chatData.name === GROUP_NAME && !IS_ADMIN) {
			const spreadSheetId = SHEET_ID;

			if (msg.body.toLowerCase().startsWith("form uni")) {
				await newcomerEvents.addNewcomerExternal(spreadSheetId, msg);
				return;
			}
		}
	});
};

const validateSessionNew = async (
	senderNumber: string,
	chatId: string
): Promise<Boolean> => {
	const sessionsFound = await db
		.select({ count: count() })
		.from(sessions)
		.where(eq(sessions.phoneNumber, senderNumber));

	await db
		.delete(sessions)
		.where(
			sql`${sessions.expiredDatetime} <= strftime('%s', 'now', '+7 hours')`
		)
		.returning();

	if (sessionsFound[0].count === 1) {
		// pakai expired date untuk kirim lagi chat "hi", mungkin expirednya kasih agak lama?
		await db
			.update(sessions)
			.set({
				expiredDatetime: sql`(strftime('%s', 'now', '+7 hours') + 600)`,
			})
			.where(eq(sessions.phoneNumber, senderNumber));

		return false;
	} else if (sessionsFound[0].count === 0) {
		await db.insert(sessions).values({
			chatId: chatId,
			phoneNumber: senderNumber,
			expiredDatetime: sql`(strftime('%s', 'now', '+7 hours') + 600)`,
		});

		return true;
	}

	return false;
};
