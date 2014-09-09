'use strict';

angular.module('searchApp')
  .directive('viewOne', [ '$window', 'ImageService', function ($window, ImageService) {
    return {
      templateUrl: 'views/view-one.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          scope.showLoadingIndicator = true;
          scope.showImage = null;

          scope.data = ImageService.get();

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

          var img = new Image();
          img.onload = function() {
              scope.$apply(function() {
                  scope.showLoadingIndicator = null;
                  scope.showImage = true;
                  scope.showDetails = true;
              })
          }
          img.src = scope.data.fullsize;

          scope.back = function() {
              $window.history.back();
          }
      }
    };
  }]);
