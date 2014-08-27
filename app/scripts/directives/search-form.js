'use strict';

angular.module('searchApp')
  .directive('searchForm', [ '$rootScope', '$routeParams', '$timeout', '$location', 'SolrService',
    function ($rootScope, $routeParams, $timeout, $location, SolrService) {
    return {
      templateUrl: 'views/search-form.html',
      restrict: 'E',
      scope: {
          help: '@',
          deployment: '@',
          site: '@',
          searchType: '@'
      },
      link: function postLink(scope, element, attrs) {

          // handle the app being bootstrapped
          $rootScope.$on('app-bootstrapped', function() {
              scope.setSearchBox();
              scope.setSearchType(scope.searchType);
          });

          // set the query box and search type if initialising from saved stated
          $rootScope.$on('init-from-saved-state-complete', function() {
              scope.searchBox = SolrService.term;
              scope.setSearchType(SolrService.searchType);
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
          scope.ready = SolrService.init(scope.deployment, scope.site);

          //var timeout = Object.keys($routeParams).length * 200 + 100;
          //$timeout(function() { scope.search(); }, timeout);
          //$timeout(function() { $rootScope.$broadcast('app-ready'); }, 3000);
      },
    };
  }]);
