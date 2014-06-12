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
  .directive('facetWidget', [ '$rootScope', 'SolrService', function ($rootScope, SolrService) {
    return {
        templateUrl: 'views/facet-widget.html',
        restrict: 'E',
        scope: {
            facetField: '@',
            label: '@',
            join: '@'
        },
        link: function postLink(scope, element, attrs) {
            if (scope.join === undefined) { 
                scope.join = 'OR';
            }
            SolrService.filterUnion[scope.facetField] = scope.join;
            scope.displayLimit = 8;
            scope.selected = [];
            if (SolrService.filters[scope.facetField] !== undefined) {
                for (var i=0; i < SolrService.filters[scope.facetField].length; i++) {
                    scope.selected.push(SolrService.filters[scope.facetField][i]);
                }
                if (scope.selected.length > 0) { scope.isCollapsed = true; }
            }

            $rootScope.$on(scope.facetField+'-facets-updated', function() {
                var f = SolrService.facets[scope.facetField];
                var i;
                for (i=0; i < f.length; i++) {
                    if (scope.selected.indexOf(f[i][0]) !== -1) {
                        f[i][2] = true;
                    }
                }
                for (i=0; i < f.length; i++) {
                    if (f[i][1] === 0 && i < scope.displayLimit) {
                        f = f.slice(0, i);
                    } else {
                        f = f.slice(0, scope.displayLimit);
                    }
                }

                scope.facets = f;
                if (SolrService.facets[scope.facetField].length > scope.displayLimit) {
                    scope.moreResults = true;
                }
            });

            $rootScope.$on('reset-all-filters', function() {
                for (var i=0; i < scope.facets.length; i++) {
                    scope.facets[i][2] = false;
                    scope.selected = [];
                }
            });

            if (scope.selected.length === 0) {
                SolrService.updateFacetCount(scope.facetField);
            }

            scope.showAll = function() {
                scope.facets = SolrService.facets[scope.facetField];
                scope.moreResults = false;
            };
        
            scope.facet = function(facet) {
                if (scope.selected.indexOf(facet) === -1) {
                    scope.selected.push(facet);
                } else {
                    scope.selected.splice(scope.selected.indexOf(facet), 1);
                }
                SolrService.filterQuery(scope.facetField, facet);
                for (var i = 0; i < scope.facets.length; i++) {
                    if (scope.facets[i][0] === facet) {
                        scope.facets[i][2] = true;
                    }
                }
            };
      }
    };
  }]);
