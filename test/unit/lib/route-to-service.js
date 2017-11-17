var routeToService = require('../../../src/lib/route-to-service.js'),
    assert = require('assert'),
    when = require('when'),  
    nock = require('nock');

describe('lib/route-to-service', () => { 
  describe('#getServiceURL', () => {
    context('discovery method: docker-compose', () => {
      var env; 
      var productService = null;
      var productServiceStaging = null;
      beforeEach(() => {
        env = process.env;
        productService = nock('https://products-service')
        .get('/products') 
        .reply(200, [{
            'name':'product1'
        }]);

        productService = nock('https://staging1.products-service')
        .get('/products') 
        .reply(200, [{
            'name':'product2'
        }]);
      });
      afterEach(() => { 
        process.env = env;
      });
 
      it('should not append or prepend anything to the service name (default)', () => {
        process.env.ENVIRONMENT_NAME="";
        process.env.DISCOVERY_METHOD="";
        return when(routeToService.send({'url':'https://products-service/products'}))
        .then(products => {
            assert(products);
            assert.equal(products,"[{\"name\":\"product1\"}]"); 
        });
      });

      it('should not append or prepend anything to the service name (docker-compose set)', () => {
        process.env.ENVIRONMENT_NAME="";
        process.env.DISCOVERY_METHOD="docker-compose";
        return when(routeToService.send({'url':'https://products-service/products'}))
        .then(products => {
            assert(products);
            assert.equal(products,"[{\"name\":\"product1\"}]"); 
        });
      });
      it('should prepend staging1 to the service name', () => {
        process.env.ENVIRONMENT_NAME="staging1";
        process.env.DISCOVERY_METHOD="";
        return when(routeToService.send({'url':'https://products-service/products'}))
        .then(products => {
            assert(products);
            assert.equal(products,"[{\"name\":\"product2\"}]"); 
        });
      });

    });
  });
}); 
