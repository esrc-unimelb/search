'use strict';

angular.module('searchApp')
  .directive('searchForm', [ '$rootScope', '$routeParams', 'SolrService', function ($rootScope, $routeParams, SolrService) {
    return {
      templateUrl: 'views/search-form.html',
      restrict: 'E',
      scope: {
          help: '@',
          deployment: '@',
          site: '@',
      },
      link: function postLink(scope, element, attrs) {

          if ($routeParams.q !== undefined) {
              scope.searchBox = $routeParams.q;
          } else {
              scope.searchBox = '*';
          }

          $rootScope.$on('search-suggestion-available', function() {
              scope.suggestion = SolrService.suggestion;
          });
          $rootScope.$on('search-suggestion-removed', function() {
              scope.suggestion = SolrService.suggestion;
          });

          scope.search = function() {
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

          // let's get this party started!!
          scope.ready = SolrService.init(scope.deployment, scope.site);

          scope.$watch('ready', function() {
              scope.search();
          });
      },
    };
  }]);
