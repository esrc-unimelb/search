'use strict';

angular.module('searchApp')
  .directive('sortResults', [ 'SolrService', function (SolrService) {
    return {
      templateUrl: 'views/sort-results.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.sortBy = SolrService.resultSort;

          scope.$on('search-results-updated', function() {
            scope.sortBy = SolrService.resultSort;
          });

          scope.sort = function() {
              SolrService.sort = scope.sortBy;
              SolrService.reSort();
          };
      }
    };
  }]);
