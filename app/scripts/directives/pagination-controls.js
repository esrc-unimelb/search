'use strict';

angular.module('searchApp')
  .directive('paginationControls', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/pagination-controls.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

          scope.show_prev = false;
          scope.show_next = false;
          $rootScope.$on('search-results-updated', function() {
              toggleControls();
          });

          scope.previous = function() {
              SolrService.previousPage();
              toggleControls();
          }

          scope.next = function() {
              SolrService.nextPage();
              toggleControls();
          }

          var toggleControls = function() {
              var cp = SolrService.getCurrentPage();
              var pt = SolrService.getLastPage();
              if (cp === 0 || isNaN(cp)) {
                  scope.show_prev = false;
              } else {
                  scope.show_prev = true;
              }

              if (cp === (pt - 1) || isNaN(pt)) {
                  scope.show_next = false;
              } else {
                  scope.show_next = true;
              }
          }
          toggleControls();
      }
    };
  }]);
