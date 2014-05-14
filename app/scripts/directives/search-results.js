'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/search-results.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.details_active = "active";
          scope.summary_active = "";
          scope.scroll_disabled = true;

          $rootScope.$on('search-results-updated', function() {
              scope.results = SolrService.results;
              scope.filters = SolrService.getFilterObject();
              if (scope.results.docs.length !== parseInt(scope.results.total)) {
                scope.scroll_disabled = false;
              }

              if (scope.details_active === 'active') {
                $rootScope.$broadcast('show-search-results-details');
              } else if (scope.summary_active === 'active') {
                $rootScope.$broadcast('hide-search-results-details');
              }
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

          scope.load_next_page = function() {
              scope.scroll_disabled = true;
              SolrService.nextPage();
          }

      }
    };
  }]);
