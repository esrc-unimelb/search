'use strict';

angular.module('searchApp')
  .directive('displayDobject', function () {
    return {
      templateUrl: 'views/display-dobject.html',
      restrict: 'E',
      scope: {
          ng-model: '='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
