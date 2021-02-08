const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint } = format;

var debugLog = createLogger({
    levels: {
      debug: 0
    },
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new (transports.File)({ 
            filename: './logs/logs_debug.log', 
            level: 'debug',
            'timestamp':true
        }),
        new (transports.Console)({level: 'debug', 'timestamp':true})
    ]
});

var errorLog = createLogger({
    levels: {
      error: 1
    },
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new (transports.File)({ 
            filename: './logs/logs_error.log', 
            level: 'error',
            'timestamp':true
        }),
        new (transports.Console)({level: 'error', 'timestamp':true})
    ]
});

var infoLog = createLogger({
    levels: {
      info: 2
    },
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new (transports.File)({ 
            filename: './logs/logs_info.log', 
            level: 'info',
            'timestamp':true
        }),
        new (transports.Console)({level: 'info', 'timestamp':true})
    ]
});

/**
 * Guardar logs
 */
exports.saveErrorLog = function(param){
    errorLog.error(param)
}
exports.saveDebugLog = function(param){
    debugLog.debug(param)
}
exports.saveInfoLog = function(param){
    infoLog.info(param)
}