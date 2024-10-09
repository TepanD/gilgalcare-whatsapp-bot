import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
	sessionId: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	chatId: text().unique().notNull(),
	phoneNumber: text(),
	expiredDatetime: integer({ mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(strftime('%s', 'now', '+7 hours'))`
	),
});
