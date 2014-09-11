'use strict';

angular.module('searchApp')
  .directive('smoothzoom', [ '$window', function ($window) {
    return {
      templateUrl: 'views/smoothzoom-view.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

          scope.init = function() {
              element.smoothZoom({
                  animation_SPEED_ZOOM: 0.5,
                  animation_SPEED_PAN: 0.5,
                  animation_SMOOTHNESS: 5, 
                  zoom_MAX: 400,
                  background_COLOR: 'black',
                  button_ALIGN: 'top right',
                  button_AUTO_HIDE: true,
                  button_SIZE: 26,
                  responsive: true
              });
          }

          scope.$watch('image_pane_height', function() {
              element.smoothZoom('destroy');
              scope.init();
          })
          /*
          scope.$watch('image', function() {
                  element.smoothZoom('destroy');
                  scope.init();
          });
          */
         
          scope.$watch('element.src', function() {
            scope.init();
          })
      }
    };
  }]);
