'use strict';

angular.module('searchApp')
  .directive('displayArcresource', function () {
    return {
      templateUrl: 'views/display-arcresource.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
