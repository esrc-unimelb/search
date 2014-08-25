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
          defaultSearch: '@'
      },
      link: function postLink(scope, element, attrs) {
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

          scope.setSearchType = function(type) {
              SolrService.searchType = type;
              scope.search();
          }

          if (scope.defaultSearch === 'keyword') {
              scope.keywordSearch = true;
              scope.setSearchType('keyword');
          } else {
              scope.phraseSearch = true;
              scope.setSearchType('phrase');
          }



          // let's get this party started!!
          scope.ready = SolrService.init(scope.deployment, scope.site);

          var timeout = Object.keys($routeParams).length * 200 + 100;
          $timeout(function() { scope.search(); }, timeout);
          //$timeout(function() { $rootScope.$broadcast('app-ready'); }, 3000);
      },
    };
  }]);
