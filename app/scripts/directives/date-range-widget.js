'use strict';

angular.module('searchApp')
  .directive('dateRangeWidget', function () {
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
          
          //
          scope.updateResultSet = function() {
              console.log(scope.ds, scope.de);
              // is start greater than end - set to end -1
              if (scope.ds > scope.de) {
                  scope.ds = scope.de -1;
              }
              // is end less than start - set to start + 1
              if (scope.de < scope.ds) { 
                  scope.de = scope.ds + 1;
              }
          }
      }
    };
  });
