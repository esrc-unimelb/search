'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', '$window', 'SolrService', function ($rootScope, $window, SolrService) {
    return {
      templateUrl: 'views/search-results.html',
      restrict: 'E',
      scope: {
          'displayProvenance': '@'
      },
      link: function postLink(scope, element, attrs) {

          /* Initialise the widget / defaults */
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

          // handle suggestions
          $rootScope.$on('search-suggestion-available', function() {
              scope.suggestion = SolrService.suggestion;
          });
          $rootScope.$on('search-suggestion-removed', function() {
              scope.suggestion = SolrService.suggestion;
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

          scope.setSuggestion = function(suggestion) {
              SolrService.search(suggestion, 0, true);
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
