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
              scope.search(SolrService.query.start);
          });

          // handle the update call
          scope.$on('reset-all-filters', function() {
              scope.searchBox = '*';
          });

          // the suggester can also trigger a search so we need to listen on
          //  search results updated and ensure the search box has the updated
          //  query term.
          scope.$on('search-results-updated', function() {
              scope.searchBox = SolrService.query.term;
          });

          scope.search = function(start) {
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

              // if start not undefined, set it to zero
              if (start === undefined) start = 0;

              // kick off the search
              SolrService.search(start, true);
          };

          scope.reset = function() {
              SolrService.reset();
          };


      },
    };
  }]);
