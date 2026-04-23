'use strict'

const winston      = require('winston')
const DailyRotate  = require('winston-daily-rotate-file')
const path         = require('path')
const morgan       = require('morgan')

const LOG_DIR = path.join(__dirname, '..', 'logs')

// ─── Custom log format ────────────────────────────────────────────────────────
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    const base = `[${timestamp}] ${level.toUpperCase().padEnd(7)}: ${message}`
    return stack ? `${base}\n${stack}` : base
  })
)

// ─── Console format (colourised in dev) ──────────────────────────────────────
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) =>
    `[${timestamp}] ${level}: ${message}`
  )
)

// ─── Rotating file transports ─────────────────────────────────────────────────
const fileTransports = [
  new DailyRotate({
    filename:    path.join(LOG_DIR, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level:       'error',
    maxFiles:    '14d',
    zippedArchive: true,
  }),
  new DailyRotate({
    filename:    path.join(LOG_DIR, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles:    '7d',
    zippedArchive: true,
  }),
]

// ─── Logger instance ──────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level:       process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format:      logFormat,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    ...fileTransports,
  ],
  exceptionHandlers: [
    new DailyRotate({
      filename:    path.join(LOG_DIR, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles:    '14d',
    }),
  ],
  exitOnError: false,
})

// ─── Morgan HTTP logger (writes to Winston stream) ────────────────────────────
const stream = {
  write: (message) => logger.http(message.trim()),
}

const httpLogger = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream }
)

module.exports = logger
module.exports.httpLogger = httpLogger