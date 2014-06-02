'use strict';

angular.module('searchApp')
  .directive('dateFacetWidget', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/date-facet-widget.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

          scope.facets = {};

          $rootScope.$on('start-date-facet-data-ready', function() {
              var a = SolrService.startDateFacets[0].values;
              for (var i=0; i < a.length; i++) {
                  var s = parseInt(a[i][0]);
                  var e = parseInt(a[i][0]) + 10;
                  var d = {
                      'start': s,
                      'end': e,
                      'label': s + ' - ' + e,
                  }
                  if (a[i][1] !== 0 && ! scope.facets[a[i][0]]) {
                      scope.facets[a[i][0]] = d;
                  }
              }
          });
          $rootScope.$on('end-date-facet-data-ready', function() {
              var a = SolrService.endDateFacets[0].values;
              for (var i=0; i < a.length; i++) {
                  var s = parseInt(a[i][0]);
                  var e = parseInt(a[i][0]) + 10;
                  var d = {
                      'start': s,
                      'end': e,
                      'label': s + ' - ' + e,
                  }
                  if (a[i][1] !== 0 && ! scope.facets[a[i][0]]) {
                      scope.facets[a[i][0]] = d;
                  }
              }
          });

          $rootScope.$on('reset-all-filters', function() {
              for (var f in scope.facets) {
                  scope.facets[f].checked = false;
              }
          });

          scope.facet = function(facet) {
              SolrService.filterDateQuery(facet);
          }


      }
    };
  }]);
