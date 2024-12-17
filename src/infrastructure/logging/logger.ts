import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json() // Logs in structured JSON format
  ),
  transports: [
    new transports.File({ filename: 'errors.log', level: 'error' }), 
    new transports.Console({ format: format.simple() }) 
  ],
});

export default logger;
