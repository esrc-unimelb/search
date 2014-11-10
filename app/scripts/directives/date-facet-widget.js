'use strict';

angular.module('searchApp')
  .directive('dateFacetWidget', [ '$rootScope', '$http', 'SolrService', function ($rootScope, $http, SolrService) {
    return {
      templateUrl: 'views/date-facet-widget.html',
      restrict: 'E',
      scope: {
          facetField: '@',
          id: '@',
          label: '@',
          start: '@',
          end: '@',
          interval: '@',
          isCollapsed: '@',
          alwaysOpen: '@',
          showPaginationControls: '@',
          existence: '@'
      },
      link: function postLink(scope, element, attrs) {
          if (scope.start === undefined) {
              console.error('start not defined. Need to pass in a year from which to start the facetting.');
          }
          if (scope.interval === undefined) {
              console.error('interval not defined. Need to pass in an interval for the range facetting.');
          }
          if (scope.id === undefined) {
              console.error('id not defined. Need to pass in an id for the range facetting.');
          }
          if (scope.isCollapsed === undefined) {
              scope.isCollapsed = true;
          } else {
              scope.isCollapsed = angular.fromJson(scope.isCollapsed);
          }
          if (scope.alwaysOpen === undefined) {
              scope.alwaysOpen = false;
          } else {
              scope.alwaysOpen = angular.fromJson(scope.alwaysOpen);
          }
          if (scope.showPaginationControls === undefined) {
              scope.showPaginationControls = true;
          } else {
              scope.showPaginationControls = angular.fromJson(scope.showPaginationControls);
          }
          if (scope.existence === undefined) {
              scope.existence = false;
          } else {
              scope.existence = angular.fromJson(scope.existence);
          }

          scope.$on('app-ready', function() {
              if (scope.end === undefined) {
                  scope.end = new Date().getFullYear();
              }
              SolrService.compileDateFacets(scope.facetField, scope.id, scope.start, scope.end, scope.interval);
          })
          scope.$on('update-date-facets', function() {
              SolrService.compileDateFacets(scope.facetField, scope.id, scope.start, scope.end, scope.interval);
          })

          scope.facets = []; 
          scope.selected = [];

          scope.$on('reset-date-facets', function() {
              scope.facets = [];
          });

          scope.$on(scope.facetField + '_' + scope.id + '-facet-data-ready', function() {
              var a = SolrService.dateFacets[scope.facetField + '_' + scope.id];
              updateFacets(a);
              updateSelections();
          });

          scope.$on('reset-all-filters', function() {
              scope.selected = [];
              updateSelections();
          });

          var updateFacets = function(data) {
              scope.facets = [];
              var d;
              angular.forEach(data, function(v, k) {
                  d = {
                      'start': v.rangeStart,
                      'end': v.rangeEnd, 
                      'label': v.rangeStart + ' - ' + v.rangeEnd,
                      'count': v.count,
                      'checked': false
                  }
                  scope.facets.push(d);
              })
          }
          var updateSelections = function() {
              angular.forEach(scope.facets, function(v, k) {
                  if (scope.selected.indexOf(v.label) !== -1) {
                      scope.facets[k].checked = true;
                  } else {
                      scope.facets[k].checked = false;
                  }
              })
          };

          scope.toggleFacet = function(facetLabel) {
              SolrService.filterDateQuery(scope.facetField, facetLabel, scope.existence);
              if (scope.selected.indexOf(facetLabel) === -1) {
                  scope.selected.push(facetLabel);
              } else {
                  scope.selected.splice(scope.selected.indexOf(facetLabel), 1);
              }
          }

      }
    };
  }]);
