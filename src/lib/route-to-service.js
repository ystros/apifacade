const url = require('url');
const logger = require('winston');
const when = require('when');
const nodefn = require('when/node');


/*
 *  Expects request URL to be of the form
 *    [service-name]/[resource]  e.g. products-service/products
 *  Transforms request url based on discovery method
 *    docker-compose:   no change needed
 *    consul:  
 */
function getServiceURL(options) {
  const key = options.uri ? 'uri' : 'url';
  var u = url.parse(options[key]);
  var host = u.hostname;
  if(process.env.ENVIRONMENT_NAME) {
    host = process.env.ENVIRONMENT_NAME+"."+host;
  }
  if (!process.env.DISCOVERY_METHOD || process.env.DISCOVERY_METHOD == 'docker-compose') {
    options[key] = u.protocol+'//'+host;
    return options;
  }  
}

module.exports.getServiceURL = getServiceURL;
