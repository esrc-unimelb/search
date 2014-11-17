'use strict';

angular.module('searchApp')
  .directive('gridView', [ 'SolrService', 'ImageService', '$window', function (SolrService, ImageService, $window) {
    return {
      templateUrl: 'views/grid-view.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          scope.rowCount = 3;
          scope.isImage = false;

          var updateResults = function() {
              scope.docs = [];
              scope.results = SolrService.results.docs;
              for (var i=0; i < scope.results.length; i += scope.rowCount) {
                  var d = [];
                  scope.results.sequenceNo = i;
                  for (var j=0; j < scope.rowCount; j++) {
                      if (scope.results[i+j] !== undefined) {
                          if (ImageService.isImage(scope.results[i+j].fullsize)) {
                              scope.results[i+j].isImage = true;
                          } else {
                              scope.results[i+j].isImage = false;

                          }
                          d.push(scope.results[i+j]);
                      }
                  }
                  scope.docs.push(d);
              }
          }
          updateResults();

          /* handle data updates */
          scope.$on('search-results-updated', function() {
              updateResults();
          })

          scope.view = function(data) {
            if (data.isImage) {
                ImageService.push(data);
            } else {
                $window.location = data.fullsize;
            }
          }

      }
    };
  }]);
