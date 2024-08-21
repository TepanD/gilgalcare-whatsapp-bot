import path from "path";
import winston, { format, transports } from "winston";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = "logs";
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const transportFile = new DailyRotateFile({
	level: "info",
	filename: "newcomer-whatsapp-bot-%DATE%.log",
	dirname: logDir,
	datePattern: "DD-MM-YYYY-HH",
	zippedArchive: false,
	maxSize: "50m",
	maxFiles: "2h",
	format: format.combine(format.json()),
});

const consoleFormat = format.printf(({ level, message, label, timestamp }) => {
	return `${timestamp} ${level} [${label}]: ${message}`;
});

const transportConsole = new transports.Console({
	format: format.combine(format.colorize(), format.splat(), consoleFormat),
});

const logger = winston.createLogger({
	level: "info",
	format: format.combine(
		format.label({
			label: path.basename(require.main?.filename ?? ""),
		}),
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({ stack: true }),
		format.metadata({
			fillExcept: ["message", "level", "timestamp", "label"],
		})
	),
	defaultMeta: { service: "newcomer-whatsapp-bot" },
	transports: [transportFile, transportConsole],
});

export default logger;
