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
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const fs = require('fs');
const mongoose = require('mongoose');
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

// connect to mongo
var mongo_credentials = ''
if(process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
  mongo_credentials = process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@';
}
var configuration = {
  mongo: {
    uri: "mongodb://" + mongo_credentials + "facade-db/registry",
  }
};

function connectToMongo(uri) {
  return when(mongoose.connect(uri, {useMongoClient: true, server: {reconnectTries: 10}}))
  .otherwise(function(err) {
    logger.warn('Failed to connect to mongo on startup - retry in 10s: %s', err.stack, {});
    mongoose.disconnect();
    setTimeout(function () { return connectToMongo(uri).done(); }, 10000);
  });
}

connectToMongo(configuration.mongo.uri);
mongoose.Promise = when.promise;
mongoose.connection.on('connected', function() {
  logger.info('Connected to mongo!');
  require('./models');

  // load the swagger api def
  // swaggerRouter configuration
  var options = {
    swaggerUi: '/swagger.json',
    controllers: './controllers',
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
  };

  // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
  var spec = fs.readFileSync('./swagger.yaml', 'utf8');
  var swaggerDoc = jsyaml.safeLoad(spec);

  // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // Let listeners know we are ready
    emitter.emit('ready', app);

  });
});
