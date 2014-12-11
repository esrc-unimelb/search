'use strict';

angular.module('searchApp')
  .directive('dateRangeWidget', [ 'SolrService', function (SolrService) {
    return {
      templateUrl: 'views/date-range-widget.html',
      restrict: 'E',
      scope: {
          dateStart: '@',
          dateEnd: '@'
      },
      link: function postLink(scope, element, attrs) {
          // is date end defined - if not, set to end of the current year
          var d = new Date();
          scope.ds = parseInt(scope.dateStart);
          scope.de = scope.dateEnd === undefined                         ? parseInt(d.getFullYear()) : parseInt(angular.fromJson(scope.dateEnd));
          scope.start = scope.ds;
          scope.end = scope.de;

          scope.$on('reset-all-filters', function() {
              scope.ds = scope.start;
              scope.de = scope.end;
          })
          
          //
          scope.updateResultSet = function() {
              // are start and end numbers?
              console.log(parseInt(scope.ds), parseInt(scope.de));
              if (isNaN(scope.ds)) {
                  scope.ds = scope.start;
              }
              if (isNaN(scope.de)) {
                  scope.de = scope.end;
              }

              // is start greater than end - set to end -1
              if (scope.ds > scope.de) {
                  scope.ds = scope.de -1;
              }
              // is end less than start - set to start + 1
              if (scope.de < scope.ds) { 
                  scope.de = scope.ds + 1;
              }
              SolrService.filterDateQuery(null, scope.ds, scope.de, scope.ds + ' - ' + scope.de)
          }
      }
    };
  }]);
