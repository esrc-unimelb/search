'use strict';

angular.module('searchApp')
  .directive('renderMods', function () {
    return {
      templateUrl: 'views/render-mods.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
