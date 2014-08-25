'use strict';

describe('Directive: displayArcresource', function () {

  // load the directive's module
  beforeEach(module('searchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<display-arcresource></display-arcresource>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the displayArcresource directive');
  }));
});
