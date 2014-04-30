'use strict';

describe('Directive: basicSearch', function () {

  // load the directive's module
  beforeEach(module('searchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<basic-search></basic-search>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the basicSearch directive');
  }));
});
