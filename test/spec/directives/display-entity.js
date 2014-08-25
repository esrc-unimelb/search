'use strict';

describe('Directive: displayEntity', function () {

  // load the directive's module
  beforeEach(module('searchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<display-entity></display-entity>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the displayEntity directive');
  }));
});
