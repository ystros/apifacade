const url = require('url');
const logger = require('winston');
const when = require('when');
const nodefn = require('when/node');
const dns = require('dns');
const proxy = require('express-http-proxy');
const _ = require('lodash');

const request = require('request-promise');

function getHostName(serviceName) {
  return nodefn
    .call(dns.resolveSrv, serviceName)
    .then(function(srvs) {
      logger.info("srvs="+JSON.stringify(srvs));
      return when
        .map(srvs, function(srv) {
          return nodefn
            .call(dns.resolve, srv.name)
            .then(function(a) { 
              return a + ':' + srv.port;
            });
        });
    })
    .then(function(hosts) {
      return  hosts.join(',');
    });
}

/**
 * Convert the passed in request to a discovery neutral service request
 */
function send(req, resp) {
    let pathElements = req.url.split('/');
    logger.info("pathElements="+pathElements);
    let serviceName = pathElements.shift();
    if (serviceName.length === 0 && pathElements.length > 0) {
        serviceName = pathElements.shift();
    }

    let path = "/" + _.join(pathElements, '/');

    logger.info("serviceName: " + serviceName);
    logger.info("path: " + path);

    // TODO lookup service registry (404 if no entry)

    // TODO dns resolve service host
   
    // TODO apply service policy check

    // TODO if service policy check failed, apply user policy check

    // proxy the request to the service
    return getHostName(serviceName)
      .then((hosts) => {
        logger.info('hosts='+hosts);
        return proxy(hosts, {
            proxyReqPathResolver: function(req) {
                return path;
            }
        })(req, resp); 
     });
};

/*
 *  Expects request URL to be of the form
 *    [service-name]/[resource]  e.g. products-service/products
 *  Transforms request url based on discovery method
 *    docker-compose:   no change needed
 *    consul:  
 */
function getServiceURL(req, service) {
  const key = req.uri ? 'uri' : 'url';
  var u = url.parse(options[key]);
  var host = u.hostname;
  if(process.env.ENVIRONMENT_NAME) {
    host = process.env.ENVIRONMENT_NAME+"."+host;
  }
  if (!process.env.DISCOVERY_METHOD || process.env.DISCOVERY_METHOD == 'docker-compose') {
    req[key] = u.protocol+'//'+host + u.path;
    return options;
  }  
}

logger.info("DISCOVERY_DNS:" + process.env.DISCOVERY_DNS);
if(process.env.DISCOVERY_DNS) {
  logger.info("USING DISCOVERY_DNS:" + process.env.DISCOVERY_DNS); 
  dns.setServers([process.env.DISCOVERY_DNS]);
}

module.exports.send = send;
