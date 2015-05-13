'use strict';

angular.module('searchApp')
  .directive('displayDobject', [ '$log', 'ImageService', function (log, ImageService) {
    return {
      templateUrl: 'views/display-dobject.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
          scope.showImage = false;
          scope.data.isImage = ImageService.isImage(scope.data.fullsize);

          scope.view = function() {
              scope.imageData = scope.data;
          }

      }
    };
  }]);
