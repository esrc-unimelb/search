'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', '$window', 'SolrService', function ($rootScope, $window, SolrService) {
    return {
      templateUrl: 'views/search-results.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

          /* Initialise the widget / defaults */
          scope.height = $window.innerHeight - 250;
          scope.showFilters = false;
          scope.site = SolrService.site;
          scope.summaryActive = '';
          scope.detailsActive = 'active';

          /* handle data updates */
          $rootScope.$on('search-results-updated', function() {
              scope.results = SolrService.results;
              scope.filters = SolrService.getFilterObject();
              if (scope.results.docs.length !== parseInt(scope.results.total)) {
                scope.scrollDisabled = false;
              }
          });

          /* handle summary / detail view toggle */
          $rootScope.$on('show-search-results-details', function() {
              scope.summaryActive = '';
              scope.detailsActive = 'active';
          });
          $rootScope.$on('hide-search-results-details', function() {
              scope.summaryActive = 'active';
              scope.detailsActive = '';
          });

          /* button methods */
          scope.toggleDetails = function(show) {
              SolrService.toggleDetails(show);
          };

          scope.loadNextPage = function() {
              SolrService.nextPage();
          };

          scope.clearAllFilters = function() {
            SolrService.clearAllFilters();
          };

      }
    };
  }]);
