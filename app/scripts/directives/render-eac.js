'use strict';

angular.module('searchApp')
  .directive('renderEac', function () {
    return {
      templateUrl: 'views/render-eac.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
