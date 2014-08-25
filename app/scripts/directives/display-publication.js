'use strict';

angular.module('searchApp')
  .directive('displayPublication', function () {
    return {
      templateUrl: 'views/display-publication.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
