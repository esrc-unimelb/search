'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', '$window', '$location', '$anchorScroll', 'SolrService', 
        function ($rootScope, $window, $location, $anchorScroll, SolrService) {
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
          scope.$on('search-results-updated', function() {
              scope.results = SolrService.results;
              scope.filters = SolrService.getFilterObject();

              // figure out what to do with pagination
              scope.togglePageControls();

              // scroll to the top of the results list
              var o = $location.hash();
              $location.hash('topSearchResults');
              $anchorScroll()
              $location.hash(o);
          });

          // handle suggestions
          scope.$on('search-suggestion-available', function() {
              scope.suggestion = SolrService.suggestion;
          });
          scope.$on('search-suggestion-removed', function() {
              scope.suggestion = SolrService.suggestion;
          });

          /* handle summary / detail view toggle */
          scope.$on('show-search-results-details', function() {
              scope.summaryActive = '';
              scope.detailsActive = 'active';
          });
          scope.$on('hide-search-results-details', function() {
              scope.summaryActive = 'active';
              scope.detailsActive = '';
          });

          scope.setSuggestion = function(suggestion) {
              SolrService.search(suggestion, 0, true);
          };

          scope.nextPage = function() {
              SolrService.nextPage();
          }
          scope.previousPage = function() {
              SolrService.previousPage();
          }
          scope.togglePageControls = function() {
              if (SolrService.results.start === 0) {
                  scope.disablePrevious = true;
              } else {
                  scope.disablePrevious = false;
              }

              if (SolrService.results.start + SolrService.rows >= scope.results.total) {
                  scope.disableNext = true;
              } else {
                  scope.disableNext = false;
              }
          }

          scope.clearAllFilters = function() {
            SolrService.clearAllFilters();
          };

      }
    };
  }]);
