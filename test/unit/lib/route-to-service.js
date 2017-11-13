var routeToService = require('../../../src/lib/route-to-service.js');
const assert = require('assert');

describe('lib/route-to-service', () => { 
  describe('#getServiceURL', () => {
    context('discovery method: docker-compose', () => {
      var env; 
      beforeEach(() => {
        env = process.env;
      });
      afterEach(() => { 
        process.env = env;
      }); 
      it('should not append or prepend anything to the service name (default)', () => {
        process.env.ENVIRONMENT_NAME="";
        process.env.DISCOVERY_METHOD="";
        var opts = routeToService.getServiceURL({'url':'https://products-service'});
        assert.equal(opts['url'], 'https://products-service');
      });

      it('should not append or prepend anything to the service name (docker-compose set)', () => {
        process.env.ENVIRONMENT_NAME="";
        process.env.DISCOVERY_METHOD="docker-compose";
        var opts = routeToService.getServiceURL({'url':'https://products-service'});
        assert.equal(opts['url'], 'https://products-service');
      });
      it('should prepend staging1 to the service name', () => {
        process.env.ENVIRONMENT_NAME="staging1";
        process.env.DISCOVERY_METHOD="";
        var opts = routeToService.getServiceURL({'url':'https://products-service'});
        assert.equal(opts['url'], 'https://staging1.products-service');
      });

    });
  });
}); 
