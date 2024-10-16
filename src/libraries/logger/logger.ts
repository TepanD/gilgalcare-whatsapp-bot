import path from "path";
import winston, { format, transports } from "winston";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

const LOG_DIR = "./dist/logs";
if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR);
}

//transport file options
const transportFile = new DailyRotateFile({
	level: "info",
	filename: "newcomer-whatsapp-bot-%DATE%.log",
	dirname: LOG_DIR,
	datePattern: "DD-MM-YYYY-HH",
	zippedArchive: false,
	maxSize: "50m",
	maxFiles: "2h",
	format: format.combine(format.json()),
});

//transport console options
// const consoleFormat = format.printf(({ level, message, label, timestamp }) => {
// 	return `${timestamp} ${level} [${label}]: ${message}`;
// });
// const transportConsole = new transports.Console({
// 	level: "debug",
// 	format: format.combine(format.colorize(), format.splat(), consoleFormat),
// });
const transportConsole = new transports.Console({
	level: "debug",
	format: format.combine(format.splat(), format.json()),
});

//create logger
const logger = winston.createLogger({
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
