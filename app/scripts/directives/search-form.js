'use strict';

angular.module('searchApp')
  .directive('searchForm', [ '$rootScope', '$routeParams', '$timeout', 'SolrService', function ($rootScope, $routeParams, $timeout, SolrService) {
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

          $rootScope.$on('$locationChangeStart', function(e, n, c) {
              scope.ready = SolrService.init(scope.deployment, scope.site);
          });

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

          // let's get this party started!!
          scope.ready = SolrService.init(scope.deployment, scope.site);

          var timeout = Object.keys($routeParams).length * 200 + 100;
          $timeout(function() { scope.search(); }, timeout);
          //$timeout(function() { $rootScope.$broadcast('app-ready'); }, 3000);
      },
    };
  }]);
