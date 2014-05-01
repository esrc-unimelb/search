'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/search-results.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

          $rootScope.$on('search-results-updated', function() {
              scope.results = SolrService.results;
          });
      }
    };
  }]);
