'use strict';

angular.module('searchApp')
  .directive('dateRangeGraph', [ '$rootScope', '$window', 'SolrService', function ($rootScope, $window, SolrService) {
    return {
      templateUrl: 'views/date-range-graph.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          SolrService.dateOuterBounds();
          scope.startDateBoundary = undefined;
          scope.endDateBoundary = undefined;

          $rootScope.$on('date-boundary-start-found', function() {
              if (SolrService.dateEndBoundary !== undefined) {
                  SolrService.compileDateFacets();
              }

          });
          $rootScope.$on('date-boundary-end-found', function() {
              if (SolrService.dateStartBoundary !== undefined) {
                    SolrService.compileDateFacets();
              }
          });


          $rootScope.$on('start-date-facet-data-ready', function() {
              if (SolrService.endDateFacets !== undefined) {
                  compileFacetCounts();
              }
          });
          $rootScope.$on('end-date-facet-data-ready', function() {
              if (SolrService.startDateFacets !== undefined) {
                  compileFacetCounts();
              }
          });

          var compileFacetCounts = function() {
              scope.dateFacets = SolrService.startDateFacets;
          //    var a = SolrService.endDateFacets[0].values;
          //    for (var i=0; i < a.length; i++) {
          //        scope.dateFacets[0].values[i][1] += a[i][1];
          //    }
          }

          scope.selection = function(x) {
              console.log(x);
          }

          scope.toolTipContentFunction = function() {
              console.log('here');
          }

      }
    };
  }]);
