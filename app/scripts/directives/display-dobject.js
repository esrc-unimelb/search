'use strict';

angular.module('searchApp')
  .directive('displayDobject', [ '$window', '$document', function ($window, $document) {
    return {
      templateUrl: 'views/display-dobject.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {

          // bind to the keyup event on the document and ditch the
          //  preview on escape
          $document.bind('keyup', function(event) {
              if (scope.showImage) {
                  scope.$apply(function() {
                      if (event.keyCode === 27) {
                          scope.ditchPreview();
                      }
                  });
              }
          });

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
