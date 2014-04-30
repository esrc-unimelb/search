'use strict';

describe('Service: Loggerservice', function () {

  // load the service's module
  beforeEach(module('searchApp'));

  // instantiate service
  var Loggerservice;
  beforeEach(inject(function (_Loggerservice_) {
    Loggerservice = _Loggerservice_;
  }));

  it('should do something', function () {
    expect(!!Loggerservice).toBe(true);
  });

});
