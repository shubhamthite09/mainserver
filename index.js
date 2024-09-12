const express = require('express');
const app = express();
const port = 3001;
const { splitoServer } = require("./Splito/index");
const winston = require('winston');
const { format, transports } = winston;
const DailyRotateFile = require('winston-daily-rotate-file');
const { pool } = require("./Splito/config/db");

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
});

// Middleware to log all requests and responses
app.use((req, res, next) => {
  const startTime = new Date().toISOString();
  
  // Log the request details
  logger.info(`Request: ${req.method} ${req.originalUrl} at ${startTime}`);
  
  // Log the response status after it's sent
  res.on('finish', () => {
    const statusCode = res.statusCode;
    const endTime = new Date().toISOString();
    if (statusCode >= 400) {
      logger.error(`Response: ${statusCode} for ${req.method} ${req.originalUrl} at ${endTime}`);
    } else {
      logger.info(`Response: ${statusCode} for ${req.method} ${req.originalUrl} at ${endTime}`);
    }
  });

  next();
});

logger.add(new DailyRotateFile({
  filename: 'logs/logs-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d' 
}));

logger.add(new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
}));
 
// Mount sub-servers
app.use('/Splito', splitoServer);

// Main server route
app.use('/', async (req, res, next) => {
  try {
    res.status(200).json({ error: false, msg: "Main server ok" });
    logger.info("200 OK response from main server");
  } catch (err) {
    res.status(500).json({ error: true, msg: "Main server error" });
    logger.error("500 Internal Server Error from main server");
  }
});

// Base server
app.listen(port, () => {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client', err.stack);
      logger.error(`DB Error -------- ${ err.stack}`);
      return
    }
    console.log(`Database connected`);
    logger.info(`Database connected`);
  });
  console.log(`Main server running on port ${port}`);
  logger.info(`Main server running on port ${port}`);
});

