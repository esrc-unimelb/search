'use strict';

angular.module('searchApp')
  .directive('sortResults', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/sort-results.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.sortBy = SolrService.query.sort;

          scope.$on('search-results-updated', function() {
            scope.sortBy = SolrService.query.sort;
          });

          scope.sort = function() {
              SolrService.reSort(scope.sortBy);
          };
      }
    };
  }]);
