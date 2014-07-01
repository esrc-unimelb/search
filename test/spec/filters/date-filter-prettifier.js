'use strict';

describe('Filter: dateFilterPrettifier', function () {

  // load the filter's module
  beforeEach(module('searchApp'));

  // initialize a new instance of the filter before each test
  var dateFilterPrettifier;
  beforeEach(inject(function ($filter) {
    dateFilterPrettifier = $filter('dateFilterPrettifier');
  }));

  it('should return the input prefixed with "dateFilterPrettifier filter:"', function () {
    var text = 'angularjs';
    expect(dateFilterPrettifier(text)).toBe('dateFilterPrettifier filter: ' + text);
  });

});
