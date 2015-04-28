'use strict';

angular.module('searchApp')
  .directive('searchResults', [ '$rootScope', '$window', '$timeout', '$location', '$anchorScroll', 'SolrService', 
        function ($rootScope, $window, $timeout, $location, $anchorScroll, SolrService) {
    return {
      templateUrl: 'views/search-results.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {

          // Initialise the widget / defaults
          scope.showFilters = false;
          scope.site = SolrService.site;
          scope.summaryActive = '';
          scope.detailsActive = 'active';

          // put a watch on results.dateStamp to do stuff when it changes
          scope.$watch(function() { return SolrService.results.dateStamp;}, function() {
              // data updated - do fancy things

              // save the data in scope
              scope.results = SolrService.results;

              // but if any of the results has undefined for the thumbnail - ditch it
              var thumbs = _.groupBy(SolrService.results.docs, function(d) { return d.thumbnail; });
              scope.gridView = _.has(thumbs, 'undefined') ? false : true;

              // grab the filter object
              scope.filters = SolrService.getFilterObject();

              // figure out what to do with pagination
              scope.togglePageControls();

              // scroll to the top
              var o = $location.hash();
              $location.hash('resultsTop');
              $anchorScroll();
              $location.hash(o);

          }, true);

          // handle suggestions
          scope.$on('search-suggestion-available', function() {
              scope.suggestion = SolrService.suggestion;
          })
          scope.$on('search-suggestion-removed', function() {
              scope.suggestion = SolrService.suggestion;
          })

          /* handle summary / detail view toggle */
          scope.$on('show-search-results-details', function() {
              scope.summaryActive = '';
              scope.detailsActive = 'active';
          })
          scope.$on('hide-search-results-details', function() {
              scope.summaryActive = 'active';
              scope.detailsActive = '';
          })

          scope.setSuggestion = function(suggestion) {
              SolrService.query.term = suggestion;
              SolrService.search(0, true);
          }

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
          }

      }
    };
  }]);
