'use strict';

describe('Directive: provenanceView', function () {

  // load the directive's module
  beforeEach(module('searchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<provenance-view></provenance-view>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the provenanceView directive');
  }));
});
