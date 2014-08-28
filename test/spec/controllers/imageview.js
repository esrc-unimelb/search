'use strict';

describe('Controller: ImageviewctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var ImageviewctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImageviewctrlCtrl = $controller('ImageviewctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
