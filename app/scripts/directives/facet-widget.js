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
            // facet offset
            scope.offset = 0;

            // facet results per page
            scope.pageSize = 10;

            // when we get a bootstrap message - init the filter
            scope.$on('app-ready', function() {
                SolrService.updateFacetCount(scope.facetField, scope.offset, scope.pageSize);
            })

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
                } else { 
                    scope.isCollapsed = true; 
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
                for (var i=0; i < scope.facets.length; i++) {
                    scope.facets[i][2] = false;
                    scope.selected = [];
                }
            });

            scope.reset = function() {
                scope.offset = 0;
                scope.pageSize = 10;
                SolrService.updateFacetCount(scope.facetField, scope.offset , scope.pageSize);
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
                SolrService.updateFacetCount(scope.facetField, scope.offset, scope.pageSize);
            }
      }
    };
  }]);
