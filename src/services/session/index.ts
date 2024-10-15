import { sessions } from "./../../db/schema";
import { db } from "./../../db/index";
import { eq, sql, count } from "drizzle-orm";

export const validateSession = async (
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
