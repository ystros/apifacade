// To let listeners know when
// the async function initializeMiddleware has run
// and the app is ready
const EventEmitter = require('events');
const emitter = new EventEmitter();
module.exports = emitter;

// Include external modules
const os = require('os');
const logger = require('winston');
const express = require('express');
const moment = require('moment');
const util = require('util');
const when = require('when');

const hostname = os.hostname();

// Create a new server app
var app = express();

// setup the logger
logger.level = 'silly';
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  timestamp: function(){
    return moment().toISOString();
  },
  formatter: function(options){
    return [util.format('[%s] %s %s %s: ',
                        options.timestamp(),
                        process.env.NODE_ENV || 'development',
                        hostname,
                        options.level.toUpperCase()),
            (undefined !== options.message ? util.format(options.message) : '')]
      .join('');
  }
});

setTimeout(function() {
  emitter.emit('ready', app);   
}, 1000);
