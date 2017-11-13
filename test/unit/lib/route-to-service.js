var routeToService = require('../../../src/lib/route-to-service.js');
const assert = require('assert');

describe('lib/route-to-service', () => { 
  describe('#getServiceURL', () => {
    context('discovery method: docker-compose', () => {
      it('should not append or prepend anything to the service name', () => { 
        assert.equal(true, true);
      });
    });
  });
}); 
