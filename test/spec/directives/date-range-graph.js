'use strict';

describe('Directive: dateFacetWidget', function () {

  // load the directive's module
  beforeEach(module('searchApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<date-facet-widget></date-facet-widget>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dateFacetWidget directive');
  }));
});
