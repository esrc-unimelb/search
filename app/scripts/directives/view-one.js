'use strict';

angular.module('searchApp')
  .directive('viewOne', [ '$window', 'ImageService', 'SolrService', function ($window, ImageService, SolrService) {
    return {
      templateUrl: 'views/view-one.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          if (SolrService.results.docs === undefined) {
              SolrService.redirectToRoot();
          }

          // set some defaults
          scope.showLoadingIndicator = true;
          scope.showImage = null;
          
          scope.$on('search-results-updated', function() {
              peekForward();
              peekBackward();
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

          var peekForward = function() {
              if (SolrService.results.docs !== undefined) {
                  if (scope.data.sequenceNo === SolrService.results.docs.length -1) {
                      SolrService.nextPage();
                  } else {
                      var d = SolrService.results.docs[scope.sequenceNo + 1];
                      if (ImageService.isImage(d.fullsize)) {
                          scope.hideNextPager = false;
                      } else {
                          scope.hideNextPager = true;
                      }
                  }
              }
          }
          var peekBackward = function() {
              if (SolrService.results.docs !== undefined) {
                  if (scope.sequenceNo !== 0) {
                      var d = SolrService.results.docs[scope.sequenceNo - 1];
                      if (ImageService.isImage(d.fullsize)) {
                          scope.hidePreviousPager = false;
                      } else {
                          scope.hidePreviousPager = true;
                      }
                  } else {
                      scope.hidePreviousPager = true;
                  }
              }
          }

          // get the data for the image
          scope.data = ImageService.get();
          scope.sequenceNo = scope.data.sequenceNo;
          peekForward();
          peekBackward();

          scope.back = function() {
              $window.history.back();
          }

          scope.previous = function() {
              if (scope.sequenceNo !== 0) {
                  scope.sequenceNo -= 1;
                  scope.data = SolrService.results.docs[scope.sequenceNo];
                  peekForward();
                  peekBackward();
              }
          }
          scope.next = function() {
              scope.sequenceNo += 1;
              scope.data = SolrService.results.docs[scope.sequenceNo];
              peekForward();
              peekBackward();
          }
      }
    };
  }]);
