'use strict';

angular.module('searchApp')
  .directive('dateFacetWidget', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
      templateUrl: 'views/date-facet-widget.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

          scope.facets = {};
          scope.selected = [];

          $rootScope.$on('reset-date-facets', function() {
              scope.facets = {};
          });

          $rootScope.$on('start-date-facet-data-ready', function() {
              var a = SolrService.startDateFacets[0].values;
              updateFacets(a);
              updateSelections();
          });
          $rootScope.$on('end-date-facet-data-ready', function() {
              var a = SolrService.endDateFacets[0].values;
              updateFacets(a);
              updateSelections();
          });

          $rootScope.$on('reset-all-filters', function() {
              scope.selected = [];
              updateSelections();
          });

          var updateFacets = function(data) {
              for (var i=0; i < data.length; i++) {
                  var s = parseInt(data[i][0]);
                  var e = parseInt(data[i][0]) + 10;
                  var v = parseInt(data[i][0]) + 9;
                  var d = {
                      'start': s,
                      'end': e,
                      'label': s + ' - ' + v,
                  }
                  scope.facets[data[i][0]] = d;
              }
          }
          var updateSelections = function() {
              for (var f in scope.facets) {
                  if (scope.selected.indexOf(parseInt(f)) !== -1) {
                      scope.facets[f].checked = true;
                  } else {
                      scope.facets[f].checked = false;
                  }
              }
          };

          scope.facet = function(facet) {
              SolrService.filterDateQuery(facet);
              if (scope.selected.indexOf(facet) === -1) {
                  scope.selected.push(facet);
              } else {
                  scope.selected.splice(scope.selected.indexOf(facet), 1);
              }
          }


      }
    };
  }]);
