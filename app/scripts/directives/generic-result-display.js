'use strict';

/**
 * @ngdoc directive
 * @name generic-result-display
 * @restrict E
 * @scope
 * @description
 *  A UI control for displaying a search result.
 *
 * @param {expression} data - The result data.
 */
angular.module('searchApp')
  .directive('genericResultDisplay', [ '$rootScope', '$location', 'SolrService',  
    function ($rootScope, $location, SolrService) {
    return {
      templateUrl: 'views/generic-result-display.html',
      restrict: 'E',
      scope: {
          'data': '=ngModel',
          'displayProvenance': '@'
      },
      link: function postLink(scope, element, attrs) {
          scope.hideDetails = SolrService.hideDetails;

          $rootScope.$on('hide-search-results-details', function() {
              scope.hideDetails = true;
          });
          $rootScope.$on('show-search-results-details', function() {
              scope.hideDetails = false;
          });

      }
    };
  }]);
