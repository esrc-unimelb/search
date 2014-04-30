'use strict';

angular.module('searchApp')
  .directive('facpResultDisplay', function () {
    return {
      templateUrl: 'views/facp-result-display.html',
      restrict: 'E',
      scope: {
          'data': '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
