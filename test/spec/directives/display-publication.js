'use strict';

describe('Directive: displayPublication', function () {

  // load the directive's module
  beforeEach(module('searchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<display-publication></display-publication>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the displayPublication directive');
  }));
});
