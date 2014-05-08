'use strict';

angular.module('searchApp')
  .directive('paginationControls', [ '$rootScope', '$location', '$anchorScroll', 'SolrService', 
    function ($rootScope, $location, $anchorScroll, SolrService) {
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
              //scrollToTop();
          }

          scope.next = function() {
              SolrService.nextPage();
              toggleControls();
              scrollToTop();
          }

          var scrollToTop = function() {
              $location.hash('top');
              //$anchorScroll();
          }

          var toggleControls = function() {
              var cp = parseInt(SolrService.results['page_current']);
              var pt = parseInt(SolrService.results['page_total']);
              if (cp === 0 || isNaN(cp)) {
                  scope.show_prev = true;
              } else {
                  scope.show_prev = false;
              }

              if (cp === (pt - 1) || isNaN(pt)) {
                  scope.show_next = true;
              } else {
                  scope.show_next = false;
              }
          }
          toggleControls();
      }
    };
  }]);
