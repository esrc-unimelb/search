'use strict';

angular.module('searchApp')
  .directive('viewOne', [ '$window', 'ImageService', function ($window, ImageService) {
    return {
      templateUrl: 'views/view-one.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          // set some defaults
          scope.showLoadingIndicator = true;
          scope.showImage = null;

          // get the data for the image
          scope.data = ImageService.get();
          scope.data.text = scope.data.text[0].split(/\n/);

          // sort out the panels sizes
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
              })
          });

          var sizeThePanels = function() {
              scope.height = $window.innerHeight;
              scope.width = $window.innerWidth;
              scope.image_pane_height = $window.innerHeight * 0.9;
              scope.image_label_height = $window.innerHeight - scope.image_pane_height;
          }
          sizeThePanels();

          // load the image
          var img = new Image();
          img.onload = function() {
              scope.$apply(function() {
                  scope.showLoadingIndicator = null;
                  scope.showImage = true;
                  scope.showDetails = true;
              })
          }
          img.src = scope.data.large_image;

          scope.back = function() {
              $window.history.back();
          }
      }
    };
  }]);
