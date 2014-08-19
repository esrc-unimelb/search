'use strict';

angular.module('searchApp')
  .directive('provenanceView', function () {
    return {
      templateUrl: 'views/provenance-view.html',
      restrict: 'E',
      scope: {
          'data': '=',
          'displayProvenance': '@'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
