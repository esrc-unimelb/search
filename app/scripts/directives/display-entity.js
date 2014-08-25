'use strict';

angular.module('searchApp')
  .directive('displayEntity', function () {
    return {
      templateUrl: 'views/display-entity.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
