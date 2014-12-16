'use strict';

angular.module('searchApp')
  .directive('renderMods', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the renderMods directive');
      }
    };
  });
