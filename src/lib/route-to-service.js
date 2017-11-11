const url = require('url');
const logger = require('winston');


/*
 *  Expects request URL to be of the form
 *    [service-name]/[resource]  e.g. products-service/products
 *  Transforms request url based on discovery method
 *    docker-compose:   no change needed
 *    consul:  
 */
function getServiceURL(options) {
  
}

module.exports.resolveRoute = getServiceURL;
