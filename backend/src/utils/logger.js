const winston = require('winston');
const { format, transports } = winston;

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'rehearsal-scheduler-api' },
  transports: [
    // Write logs with level 'error' and below to error.log
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write logs with level 'info' and below to combined.log
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production, also log to the console with a simpler format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'HH:mm:ss' }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  }));
}

// Create a stream object for Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;