'use strict';

angular.module('searchApp')
  .directive('searchForm', [ '$routeParams', '$location', 'SolrService',
    function ($routeParams, $location, SolrService) {
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

              // the search type stored in the service overrides that
              //   set on the directive as it means we'rer restoring
              //   state
              if (SolrService.searchType !== scope.searchType) {
                  scope.setSearchType(SolrService.searchType);
              } else {
                  scope.setSearchType(scope.searchType);
              }

              if (SolrService.rows !== SolrService.defaultRows) {
                  SolrService.rows = SolrService.defaultRows;
              }
          });

          scope.$on('search-results-updated', function() {
              scope.searchBox = SolrService.term;
          });

          scope.setSearchBox = function() {
              // set the content of the search box based on any q url params
              if ($routeParams.q !== undefined) {
                  if (angular.isArray($routeParams.q)) {
                      var s = $location.search();
                      scope.searchBox = $routeParams.q[0];
                      $location.search('q', s.q[0]);
                  } else {
                    scope.searchBox = $routeParams.q;
                  }
              } else {
                  scope.searchBox = '*';
              }
          }

          scope.search = function() {
              if (scope.searchBox === '') {
                  scope.searchBox = '*';
              }

              // args:
              // - what: scope.searchBox (the search term
              // - start: 0 (record to start at)
              // - ditchSuggestion: true
              SolrService.search(scope.searchBox, 0, true);
          };

          scope.setSearchType = function(type) {
              SolrService.searchType = type;
              if (SolrService.searchType === 'phrase') {
                  scope.keywordSearch = false;
                  scope.phraseSearch = true;
              } else {
                  scope.phraseSearch = false;
                  scope.keywordSearch = true;
              }
              scope.search();
          }

          // let's get this party started!!
          scope.setSearchBox();
          scope.ready = SolrService.init();

      },
    };
  }]);
