'use strict';

describe('Filter: valueOrDash', function () {

  // load the filter's module
  beforeEach(module('searchApp'));

  // initialize a new instance of the filter before each test
  var valueOrDash;
  beforeEach(inject(function ($filter) {
    valueOrDash = $filter('valueOrDash');
  }));

  it('should return the input prefixed with "valueOrDash filter:"', function () {
    var text = 'angularjs';
    expect(valueOrDash(text)).toBe('valueOrDash filter: ' + text);
  });

});
