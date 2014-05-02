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
          scope.good_to_go = SolrService.init(scope.deployment, scope.site);

          $rootScope.$on('search-suggestion-available', function() {
              scope.suggestion = SolrService.suggestion;
          })
          $rootScope.$on('search-suggestion-removed', function() {
              scope.suggestion = SolrService.suggestion;
          })

          scope.search = function() {
              if (scope.search_box === undefined || scope.search_box === '') {
                  scope.search_box = '*';
              }
              // args:
              // - what: scope.search_box (the search term
              // - start: 0 (record to start at)
              // - ditchSuggestion: true
              SolrService.search(scope.search_box, 0, true);
          }

          scope.setSuggestion = function(suggestion) {
              scope.search_box = suggestion;
              scope.search();
          }
      },
    };
  }]);
