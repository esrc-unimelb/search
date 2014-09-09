'use strict';

angular.module('searchApp')
  .directive('viewSet', [ 'ImageService', function (ImageService) {
    return {
      templateUrl: 'views/view-set.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
        element.text('this is the viewSet directive');
      }
    };
  }]);
