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

          $rootScope.$on('start-date-boundary-start-found', function() {
              if (SolrService.startDateEndBoundary !== undefined) {
                  SolrService.compileStartDateFacets();
              }

          });
          $rootScope.$on('start-date-boundary-end-found', function() {
              if (SolrService.startDateStartBoundary !== undefined) {
                    SolrService.compileStartDateFacets();
              }
          });


          $rootScope.$on('end-date-boundary-start-found', function() {
              if (SolrService.endDateEndBoundary !== undefined) {
                  SolrService.compileEndDateFacets();
              }

          });
          $rootScope.$on('end-date-boundary-end-found', function() {
              if (SolrService.endDateStartBoundary !== undefined) {
                    SolrService.compileEndDateFacets();
              }
          });

          $rootScope.$on('start-date-facet-data-ready', function() {
              scope.startDateFacets = SolrService.startDateFacets;

          });
          $rootScope.$on('end-date-facet-data-ready', function() {
              scope.endDateFacets = SolrService.endDateFacets;

          });


          scope.selection = function(x) {
              console.log(x);
          }

          scope.toolTipContentFunction = function() {
              console.log('here');
          }

      }
    };
  }]);
