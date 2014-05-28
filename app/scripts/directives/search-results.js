'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', '$window', 'SolrService', function ($rootScope, $window, SolrService) {
    return {
      templateUrl: 'views/search-results.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.height = $window.innerHeight - 250;
          scope.scrollDisabled = true;
          scope.showFilters = false;
          scope.site = SolrService.site;
          scope.summaryAcrive = '';
          scope.detailsActive = 'active';

          $rootScope.$on('search-results-updated', function() {
              scope.results = SolrService.results;
              scope.filters = SolrService.getFilterObject();
              if (scope.results.docs.length !== parseInt(scope.results.total)) {
                scope.scrollDisabled = false;
              }
          });

          $rootScope.$on('show-search-results-details', function() {
              scope.summaryActive = '';
              scope.detailsActive = 'active';
          });
          $rootScope.$on('hide-search-results-details', function() {
              scope.summaryActive = 'active';
              scope.detailsActive = '';
          });

          // toggle detailView
          scope.toggleDetails = function(show) {
              SolrService.toggleDetails(show);
          };

          scope.loadNextPage = function() {
              scope.scrollDisabled = true;
              SolrService.nextPage();
          };

          scope.clearAllFilters = function() {
            SolrService.clearAllFilters();

          };

      }
    };
  }]);
