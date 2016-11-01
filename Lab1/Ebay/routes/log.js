/**
 * http://usejsdoc.org/
 */
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,
      level: 'info',
      json:false
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `log/-eventLogging.log`,
      timestamp: true,
      json:false,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: 'info'
    })
  ]
});


exports.logger = logger;