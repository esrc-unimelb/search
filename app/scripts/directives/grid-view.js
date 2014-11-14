'use strict';

angular.module('searchApp')
  .directive('gridView', [ 'SolrService', 'ImageService', function (SolrService, ImageService) {
    return {
      templateUrl: 'views/grid-view.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          scope.rowCount = 3;

          var updateResults = function() {
              scope.docs = [];
              scope.results = SolrService.results.docs;
              for (var i=0; i < scope.results.length; i += scope.rowCount) {
                  var d = [];
                  scope.results.sequenceNo = i;
                  for (var j=0; j < scope.rowCount; j++) {
                      if (scope.results[i+j] !== undefined) {
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
            ImageService.push(data);
          }

      }
    };
  }]);
