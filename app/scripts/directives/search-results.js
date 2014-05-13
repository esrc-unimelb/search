'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/search-results.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.details_active = "active";
          scope.summary_active = "";

          $rootScope.$on('search-results-updated', function() {
              scope.results = SolrService.results;
              scope.filters = SolrService.getFilterObject();
          });

          scope.site = SolrService.site;

          scope.detail_view = function() {
              $rootScope.$broadcast('show-search-results-details');
              scope.details_active = "active";
              scope.summary_active = "";
          }
          scope.list_view = function() {
              $rootScope.$broadcast('hide-search-results-details');
              scope.summary_active = "active";
              scope.details_active = "";
          }

      }
    };
  }]);
