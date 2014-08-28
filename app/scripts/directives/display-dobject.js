'use strict';

angular.module('searchApp')
  .directive('displayDobject', [ '$window', '$location', 'ImageService', function ($window, $location, ImageService) {
    return {
      templateUrl: 'views/display-dobject.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {

          // pop the image data into the service in case we need it
          scope.key = ImageService.push(scope.data);

          // ensure none of the large image panels come up
          scope.showImage = false;

          // figure out some dimensions
          scope.h = $window.innerHeight;
          scope.w = $window.innerWidth;

          // user clicked the image - show large version
          scope.loadImage = function() {
            scope.showImage = true;
          }

          // user wants to ditch the large screen
          scope.ditchPreview = function() {
              scope.showImage = null;
          }
      }
    };
  }]);
