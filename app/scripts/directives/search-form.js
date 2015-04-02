'use strict';

angular.module('searchApp')
  .directive('searchForm', [ '$log', 'SolrService',
    function ($log, SolrService) {
    return {
      templateUrl: 'views/search-form.html',
      restrict: 'E',
      scope: {
          help: '@',
          searchType: '@'
      },
      link: function postLink(scope, element, attrs) {


          // handle the app being bootstrapped
          scope.$on('app-ready', function() {
              scope.searchBox = SolrService.term;
              scope.search();
          });

          // handle the update call
          scope.$on('reset-all-filters', function() {
              scope.searchBox = '*';
          });

          scope.search = function() {
              // args:
              // - start: 0 (record to start at)
              // - ditchSuggestion: true
              if (scope.searchBox === '') scope.searchBox = '*';
              SolrService.term = scope.searchBox;
              SolrService.search(0, true);
          };

          scope.reset = function() {
              SolrService.clearAllFilters();
          };


      },
    };
  }]);
