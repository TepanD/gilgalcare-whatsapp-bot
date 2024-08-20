
import winston,{ format } from "winston";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";


const logDir = 'logs'; 
if ( !fs.existsSync( logDir ) ) {
    fs.mkdirSync(logDir);
}

const transportFile = new DailyRotateFile({
    level: 'info',
    filename: 'newcomer-whatsapp-bot-%DATE%.log',
    dirname: logDir,
    datePattern: 'DD-MM-YYYY-HHmm',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

const tzoffset = (new Date()).getTimezoneOffset() * 60000; 

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'newcomer-whatsapp-bot' },
    transports: [
      transportFile,
      new winston.transports.Console({
        format: winston.format.printf(info => `${info.level}[${(new Date(Date.now() - tzoffset)).toISOString()}]: ${info.message}`)
      })
    ]
  });

export default logger;