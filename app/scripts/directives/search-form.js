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
              scope.searchBox = SolrService.query.term;
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

              // ensure the search box has something in it and then set it in the solrservice
              if (_.isEmpty(scope.searchBox)) scope.searchBox = '*';
              SolrService.query.term = scope.searchBox;

              // if the search box is not wildcard, set the solr service to sort descending
              if (SolrService.query.term === '*') {
                  SolrService.query.sort = 'name_sort asc';
              } else {
                  SolrService.query.sort = 'score desc';
              }

              // kick off the search
              SolrService.search(0, true);
          };

          scope.reset = function() {
              SolrService.reset();
          };


      },
    };
  }]);
