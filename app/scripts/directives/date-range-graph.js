'use strict';

angular.module('searchApp')
  .directive('dateRangeGraph', [ '$rootScope', '$window', 'SolrService', function ($rootScope, $window, SolrService) {
    return {
      templateUrl: 'views/date-range-graph.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.startDateBoundary = undefined;
          scope.endDateBoundary = undefined;

          $rootScope.$on('start-date-facet-data-ready', function() {
              scope.dateFacets = SolrService.startDateFacets;
          });

      }
    };
  }]);
