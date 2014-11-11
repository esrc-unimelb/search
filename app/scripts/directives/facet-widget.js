'use strict';

/** 
 * @ngdoc directive
 * @name facet-widget
 * @restrict E
 * @scope 
 * @description
 *  A UI control for a SOLR facet. Displays the available content as a set
 *  of checkboxes that can be added to the query as filters.
 * 
 * @param {string} facetField - The field for which to get the facet counts
 * @param {string} label - The name to be used for the widget
 * @param {string} join - The operator for joining multiple selections (default: OR)
 *
 */
angular.module('searchApp')
  .directive('facetWidget', [ 'SolrService', function (SolrService) {
    return {
        templateUrl: 'views/facet-widget.html',
        restrict: 'E',
        scope: {
            facetField: '@',
            label: '@',
            join: '@',
            isCollapsed: '@',
            alwaysOpen: '@',
            showPaginationControls: '@'
        },
        link: function postLink(scope, element, attrs) {
            // configure defaults for those optional attributes if not defined
            scope.alwaysOpen = scope.alwaysOpen === undefined                         ? false : angular.fromJson(scope.alwaysOpen);
            scope.isCollapsed = scope.isCollapsed === undefined                       ? true  : angular.fromJson(scope.isCollapsed);
            scope.showPaginationControls = scope.showPaginationControls === undefined ? true  : angular.fromJson(scope.showPaginationControls);

            // facet offset and begining page size
            scope.offset = 0;
            scope.pageSize = 10;

            // when we get a bootstrap message - init the filter
            scope.$on('app-ready', function() {
                SolrService.updateFacetCount(scope.facetField, scope.offset, scope.pageSize);
            })

            // set the union operator for multiple selections
            if (scope.join === undefined) { 
                scope.join = 'OR';
            }
            SolrService.filterUnion[scope.facetField] = scope.join;

            // when we get an update event for this widget from the solr
            //  service - rejig the widget as required
            scope.$on(scope.facetField+'-facets-updated', function() {
                var selected = SolrService.filters[scope.facetField];
                if (selected === undefined) { 
                    selected = []; 
                }

                var f = SolrService.facets[scope.facetField];
                angular.forEach(f, function(v,k) {
                    if (selected.indexOf(f[k][0]) !== -1) {
                        f[k][2] = true;
                    }
                })
                scope.facets = f;
            });

            // wipe clean if told to do so
            scope.$on('reset-all-filters', function() {
                angular.forEach(scope.facets, function(v,k) {
                    scope.facets[k][2] = false;
                })
                scope.selected = [];
            });

            scope.reset = function() {
                scope.offset = 0;
                scope.pageSize = 10;
                SolrService.clearFilter(scope.facetField);
                SolrService.updateFacetCount(scope.facetField, scope.offset , scope.pageSize);
                angular.forEach(scope.facets, function(v,k) {
                    scope.facets[k][2] = false;
                })
                scope.selected = [];
            };
        
            scope.facet = function(facet) {
                SolrService.filterQuery(scope.facetField, facet);
            };

            scope.pageForward = function() {
                scope.offset = scope.offset + scope.pageSize;
                SolrService.updateFacetCount(scope.facetField, scope.offset , scope.pageSize);
            }
            scope.pageBackward = function() {
                scope.offset = scope.offset - scope.pageSize;
                if (scope.offset < 0) { scope.offset = 0 };
                SolrService.updateFacetCount(scope.facetField, scope.offset, scope.pageSize);
            }
            scope.updatePageSize = function() {
                if (scope.pageSize === null) { scope.pageSize = 10; }
                if (scope.pageSize > 1000) { scope.pageSize = 1000; }
                SolrService.updateFacetCount(scope.facetField, scope.offset, scope.pageSize);
            }
      }
    };
  }]);
