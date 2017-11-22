const routeToService = require('../../../src/lib/route-to-service.js');
const assert = require('assert');
const when = require('when'); 
const nock = require('nock');
const sinon = require('sinon');
const dns = require('dns');

describe('lib/route-to-service', () => { 
  describe('#send', () => {
    context('discovery method: consul', () => {
      let env; 
      let productService = null;
      let productServiceStaging = null;
      let sandbox = null;

      beforeEach(() => {
        sandbox = sinon.sandbox.create();
        env = process.env;
     
        sandbox.stub(dns, 'resolveSrv')
            .usingPromise(when)
            .callsFake(function blat() {console.log("in fake function")})
            .resolves([{"name":"ac120005.addr.dc1.consul","port":5000,"priority":1,"weight":1}]);
        sandbox.stub(dns, 'resolve')
            .usingPromise(when)
            .callsFake(function blat() {console.log("in resolve fake")})
            .resolves('172.18.0.5');

        sandbox.stub(routeToService, 'getHostName')
            .usingPromise(when)
            .callsFake(function blat() {console.log('in stub for getHostName');})
            .resolves('products-service-host-port');
        productService = nock('https://products-service-host-port')
        .get('/products') 
        .reply(200, [{
            'name':'product1'
        }]);

      });
      afterEach(() => { 
        process.env = env;
        sandbox.restore();
      });
 
      it('should proxy to products-service via consul', () => {
        console.log('starting test'); 
        return when(routeToService.send({'url':'/products-service/products'}))
        .then(products => {
            assert(products);
            assert.equal(products,"[{\"name\":\"product1\"}]"); 
        });
      });

    });
  });
}); 

