'use strict';

angular.module('searchApp')
  .directive('genericResultDisplay', function () {
    return {
      templateUrl: 'views/generic-result-display.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
