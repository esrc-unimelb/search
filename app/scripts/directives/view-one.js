'use strict';

angular.module('searchApp')
  .directive('viewOne', [ '$window', 'ImageService', 'SolrService', function ($window, ImageService, SolrService) {
    return {
      templateUrl: 'views/view-one.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          // set some defaults
          scope.showLoadingIndicator = true;
          scope.showImage = null;

          scope.$on('search-results-updated', function() {
              scope.data = SolrService.results.docs[scope.sequenceNo];
              checkType();
          })

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

          var checkType = function() {
              if (scope.data.main_type !== 'Digital Object' && scope.data.type !== 'Image') {
                  scope.back();
              }
          }

          // get the data for the image
          scope.data = ImageService.get();
          scope.sequenceNo = scope.data.sequenceNo;

          scope.back = function() {
              $window.history.back();
          }

          scope.previous = function() {
              if (scope.sequenceNo !== 0) {
                  scope.sequenceNo -= 1;
                  scope.data = SolrService.results.docs[scope.sequenceNo];
                  checkType();
              }
          }
          scope.next = function() {
              scope.sequenceNo += 1;
              if (scope.data.sequenceNo === SolrService.results.docs.length -1) {
                  SolrService.nextPage();
              } else {
                  scope.data = SolrService.results.docs[scope.sequenceNo];
                  checkType();
              }
          }
      }
    };
  }]);
