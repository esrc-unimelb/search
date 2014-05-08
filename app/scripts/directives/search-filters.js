'use strict';

angular.module('searchApp')
  .directive('searchFilters', function () {
    return {
      templateUrl: 'views/search-filters.html',
      restrict: 'E',
      scope: {
          filter: '@'
      },
      link: function postLink(scope, element, attrs) {
        var filters = scope.filter.split(',');

        scope.filters = [];
        for (var i=0; i < filters.length; i++) {
            if (filters[i].indexOf(':::') !== -1) {
                scope.filters.push({ field: filters[i].split(':::')[0], label: filters[i].split(':::')[1] });
            } else {
                scope.filters.push({ field: filters[i], label: filters[i] });
            }
        }

      }
    };
  });
