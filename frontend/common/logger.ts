/*
 * Simple logger. Set the LOG_LEVEL environment variable to control what's logged.
 * 
 * See https://github.com/winstonjs/winston
 * 
 */
const { createLogger, format, transports } = require('winston')

export const logger = createLogger({
  level: process.env.LOG_LEVEL?process.env.LOG_LEVEL:'info',
  format: format.combine(
          format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
//    format.json()
  ),
  transports: [
    new transports.Console({
        format: format.combine(
                format.colorize(),
                format.simple()
          )
    })
  ]
});