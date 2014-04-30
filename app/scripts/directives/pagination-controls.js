'use strict';

angular.module('searchApp')
  .directive('paginationControls', [ 'SolrService', function (SolrService) {
    return {
      templateUrl: 'views/pagination-controls.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.show_prev = false;
          scope.show_next = true;

          scope.previous = function() {
              SolrService.previousPage().then(function(d) {
                  SolrService.saveData(d);
              })
              toggleControls();
          }

          scope.next = function() {
              SolrService.nextPage().then(function(d) {
                  SolrService.saveData(d);
              });
              toggleControls();
          }

          var toggleControls = function() {
              var cp = SolrService.getCurrentPage();
              var pt = SolrService.getPageLast();
              if (cp > 0 && cp !== pt) {
                  scope.show_prev = true;
              } else {
                  scope.show_prev = false;
              }

              if (cp === (pt - 1)) {
                  scope.show_next = false;
              } else {
                  scope.show_next = true;
              }


          }
      }
    };
  }]);
