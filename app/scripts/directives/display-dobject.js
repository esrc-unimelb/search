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

          scope.isImage = false;

          // acceptable image extensions - whatever we find will
          //  be lowercased so as to make this list a little shorter..
          var imageExts =  [ 'jpg', 'jpeg', 'png', 'gif' ];

          if (scope.data.fullsize === undefined) {
              log.error("No full size image for: " + scope.data.id);
          } else {
              // is it actually an image file - coz if it ain't we
              //  don't want to enable preview mode
              var image = scope.data.fullsize;
              var ext = image.split('/');
              var last = ext.pop();
              ext = last.split('.').pop();
              if (ext !== undefined && imageExts.indexOf(ext.toLowerCase()) !== -1) {
                  scope.isImage = true;
              }

          }

          scope.view = function() {
              // pop the image data into the service
              ImageService.push(scope.data);
          }


      }
    };
  }]);
