'use strict';

angular.module('searchApp')
  .directive('basicSearch', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/basic-search.html',
      restrict: 'E',
      scope: {
          help: '@',
          deployment: '@',
          site: '@',
          loglevel: '@'
      },
      link: function postLink(scope, element, attrs) {
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
              SolrService.init(scope.deployment, scope.site, scope.loglevel);
              SolrService.search(scope.search_box, 0, true);
          }

          scope.setSuggestion = function(suggestion) {
              scope.search_box = suggestion;
              scope.search();
          }
      }
    };
  }]);
