'use strict';

angular.module('appApp')
  .directive('searchResults', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the searchResults directive');
      }
    };
  });
