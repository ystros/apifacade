const logger = require('winston');
const http = require('http');
const app = require('./app');

logger.info("wait for app setup");

// Wait until the app has loaded swagger config
app.on('ready', app => {

  // Config server port
  var serverPort  = process.env.PORT || 3000;   

  // Start up the server
  const server = http.createServer(app).listen(serverPort, function() {
    logger.info('Server running');
  });

  // Handle Ctrl-C
  process.on('SIGTERM', () => {
    server.close(() => {
      logger.info('Express server shut down gracefully');
        process.exit(0);
      });
    });

  // Handle exceptions
  process.on('uncaughtException', function(err) {
    logger.error('Caught exception: %j', err, {});
    logger.warn(err.stack);
  });
});
