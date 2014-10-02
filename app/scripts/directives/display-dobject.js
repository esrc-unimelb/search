'use strict';

angular.module('searchApp')
  .directive('displayDobject', [ '$window', '$location', 'ImageService', 'LoggerService',
        function ($window, $location, ImageService, log) {
    return {
      templateUrl: 'views/display-dobject.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {

          scope.isImage = true;

          scope.view = function() {
              // pop the image data into the service
              ImageService.push(scope.data);
          }

      }
    };
  }]);
