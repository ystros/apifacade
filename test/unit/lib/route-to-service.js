var routeToService = require('../../../src/lib/route-to-service.js');
var assert = require('assert');
var when = require('when'); 
var nock = require('nock');
var sinon = require('sinon');
var dns = require('dns');

require('sinon-as-promised')(when);

describe('lib/route-to-service', () => { 
  describe('#send', () => {
    context('discovery method: consul', () => {
      let env; 
      let productService = null;
      let productServiceStaging = null;
      let ctx = null;
      let DNSMock = null;

      beforeEach(() => {
        ctx = sinon.sandbox.create();
        env = process.env;
        DNSMock = ctx.mock(dns); 
        productService = nock('https://products-service-host-port')
        .get('/products') 
        .reply(200, [{
            'name':'product1'
        }]);

      });
      afterEach(() => { 
        process.env = env;
        ctx.restore();
      });
 
      it('should proxy to products-service via consul', () => {
        process.env.ENVIRONMENT_NAME="";
        process.env.DISCOVERY_METHOD="";
      
        DNSMock.expects('resolveSrv')
            .withArgs('products-service.service.consul')
            .returns('https://products-service-host-port');
  
        return when(routeToService.send({'url':'/products-service/products'}))
        .then(products => {
            assert(products);
            assert.equal(products,"[{\"name\":\"product1\"}]"); 
        });
      });

    });
  });
}); 
