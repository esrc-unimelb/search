'use strict';

angular.module('searchApp')
  .directive('moreLikeThis', function () {
    return {
      templateUrl: 'views/more-like-this.html',
      restrict: 'E',
      scope: {
          source: '@',
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
          scope.toggle = false;
      }
    };
  });
