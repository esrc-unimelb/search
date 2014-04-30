'use strict';

describe('Service: Solrservice', function () {

  // load the service's module
  beforeEach(module('searchApp'));

  // instantiate service
  var Solrservice;
  beforeEach(inject(function (_Solrservice_) {
    Solrservice = _Solrservice_;
  }));

  it('should do something', function () {
    expect(!!Solrservice).toBe(true);
  });

});
