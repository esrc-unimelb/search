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
  .directive('genericResultDisplay', [ '$rootScope', function ($rootScope) {
    return {
      templateUrl: 'views/generic-result-display.html',
      restrict: 'E',
      scope: {
          data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
          scope.hideDetails = false;
          $rootScope.$on('show-search-results-details', function() {
              scope.hideDetails = false;
          });
          $rootScope.$on('hide-search-results-details', function() {
              scope.hideDetails = true;
          });
      }
    };
  }]);
