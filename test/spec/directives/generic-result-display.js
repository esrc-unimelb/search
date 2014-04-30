'use strict';

describe('Directive: genericResultDisplay', function () {

  // load the directive's module
  beforeEach(module('searchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<generic-result-display></generic-result-display>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the genericResultDisplay directive');
  }));
});
