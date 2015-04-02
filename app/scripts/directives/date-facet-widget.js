'use strict';

angular.module('searchApp')
  .directive('dateFacetWidget', [ '$log', 'SolrService', function ($log, SolrService) {
    return {
      templateUrl: 'views/date-facet-widget.html',
      restrict: 'E',
      scope: {
          facetField: '@',
          existenceFromField: '@',
          existenceToField: '@',
          id: '@',
          label: '@',
          start: '@',
          end: '@',
          interval: '@',
          isCollapsed: '@',
          alwaysOpen: '@',
          showPaginationControls: '@',
      },
      link: function postLink(scope, element, attrs) {
          // configure defaults for those optional attributes if not defined
          scope.ao = scope.alwaysOpen === undefined                         ? false : angular.fromJson(scope.alwaysOpen);
          scope.ic = scope.isCollapsed === undefined                       ? true  : angular.fromJson(scope.isCollapsed);
          scope.sp = scope.showPaginationControls === undefined ? true  : angular.fromJson(scope.showPaginationControls);

          if (scope.start === undefined) {
              $log.error('start not defined. Need to pass in a year from which to start the facetting.');
          }
          if (scope.interval === undefined) {
              $log.error('interval not defined. Need to pass in an interval for the range facetting.');
          }
          if (scope.id === undefined) {
              $log.error('id not defined. Need to pass in an id for the range facetting.');
          }

          scope.$on('update-date-facets', function() {
              SolrService.compileDateFacets(scope.facetField, scope.id, scope.start, scope.end, scope.interval);
          })

          scope.facets = []; 

          scope.$on('reset-date-facets', function() {
              scope.facets = [];
          });

          scope.$on(scope.facetField + '_' + scope.id + '-facet-data-ready', function() {
              var a = SolrService.dateFacets[scope.facetField + '_' + scope.id];
              updateFacets(a);
              updateSelections();
          });

          scope.$on('reset-all-filters', function() {
              updateSelections();
          });

          // handle open / close broadcasts
          scope.$on('open-all-filters', function() {
              scope.ic = false;
          })
          scope.$on('close-all-filters', function() {
              scope.ic = true;
         })

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
              var selected = [];
              var marker = scope.existenceFromField + '-' + scope.existenceToField + '-';
              angular.forEach(SolrService.dateFilters, function(v,k) {
                  if (v.existenceFromField === scope.existenceFromField && v.existenceToField === scope.existenceToField && v.facetField === scope.facetField) {
                    selected.push(v.label);
                  }
              })
              angular.forEach(scope.facets, function(v, k) {
                  if (selected.indexOf(v.label) !== -1) {
                      scope.facets[k].checked = true;
                      if (scope.startup === undefined) {
                          scope.ic = false;
                          scope.startup = false;
                      }
                  } else {
                      scope.facets[k].checked = false;
                  }
              })
          };

          scope.toggleFacet = function(facetLabel) {
              SolrService.filterDateQuery(scope.facetField, scope.existenceFromField, scope.existenceToField, facetLabel);
              updateSelections();
          }

          // initialise the widget
          if (scope.end === '') {
              scope.end = new Date().getFullYear();
          }
          SolrService.compileDateFacets(scope.facetField, scope.id, scope.start, scope.end, scope.interval);

      }
    };
  }]);
