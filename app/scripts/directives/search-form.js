'use strict';

angular.module('searchApp')
  .directive('searchForm', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/search-form.html',
      restrict: 'E',
      scope: {
          help: '@',
          deployment: '@',
          site: '@',
      },
      link: function postLink(scope, element, attrs) {
          // initialise the service and ensure we stop if it's broken
          scope.goodToGo = SolrService.init(scope.deployment, scope.site);

          $rootScope.$on('search-suggestion-available', function() {
              scope.suggestion = SolrService.suggestion;
          });
          $rootScope.$on('search-suggestion-removed', function() {
              scope.suggestion = SolrService.suggestion;
          });

          scope.search = function() {
              if (scope.searchBox === undefined || scope.searchBox === '') {
                  scope.searchBox = '*';
              }
              // args:
              // - what: scope.searchBox (the search term
              // - start: 0 (record to start at)
              // - ditchSuggestion: true
              SolrService.search(scope.searchBox, 0, true);
          };

          scope.setSuggestion = function(suggestion) {
              scope.searchBox = suggestion;
              scope.search();
          };
      },
    };
  }]);
