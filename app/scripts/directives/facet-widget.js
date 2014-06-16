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
            // on init - populate the widget
            SolrService.updateFacetCount(scope.facetField);

            // set the union operator for multiple selections
            if (scope.join === undefined) { 
                scope.join = 'OR';
            }
            SolrService.filterUnion[scope.facetField] = scope.join;

            // set a display limit
            scope.displayLimit = 8;

            // when we get an update event for this widget from the solr
            //  service - rejig the widget as required
            $rootScope.$on(scope.facetField+'-facets-updated', function() {
                var selected = SolrService.filters[scope.facetField];
                if (selected === undefined) { 
                    selected = []; 
                } else { 
                    scope.isCollapsed = true; 
                }

                var f = SolrService.facets[scope.facetField];
                var i;
                for (i=0; i < f.length; i++) {
                    if (selected.indexOf(f[i][0]) !== -1) {
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

            // wipe clean if told to do so
            $rootScope.$on('reset-all-filters', function() {
                for (var i=0; i < scope.facets.length; i++) {
                    scope.facets[i][2] = false;
                    scope.selected = [];
                }
            });

            scope.showAll = function() {
                scope.facets = SolrService.facets[scope.facetField];
                scope.moreResults = false;
            };
        
            scope.facet = function(facet) {
                SolrService.filterQuery(scope.facetField, facet);
            };
      }
    };
  }]);
