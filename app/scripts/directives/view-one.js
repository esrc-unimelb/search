'use strict';

angular.module('searchApp')
  .directive('viewOne', [ '$location', '$window', function ($location, $window) {
    return {
      templateUrl: 'views/view-one.html',
      restrict: 'E',
      scope: {
          imageData: '=',
      },
      link: function postLink(scope, element, attrs) {
          // as the directive is injected on page load
          //   ensure the content doesn't get loaded
          scope.showImage = false;

          // when the parent scope has set the data to show
          //  that is - an image has been clicked
          //  show the content
          scope.$watch('imageData', function() {
              if (!_.isEmpty(scope.imageData)) {
                $location.hash('view');
                scope.showImage = true;
              }
          }, true);

          // we need to intercept the locationChangeStart event
          //  and call close when the new url does not have #view
          //  in it. That is, an image is displayed and the user
          //  has pressed the back button.
          scope.$on('$locationChangeStart', function(e, n, o) {
              if (!n.match('#view')) {
                  scope.imageData = null;
                  scope.showImage = false;
              }
          });

          // handler to shut it all down
          scope.close = function() {
              $window.history.back();
          }

      }
    };
  }]);
