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
  .directive('facetWidget', [ 'SolrService', 'Configuration', function (SolrService, conf) {
    return {
        templateUrl: 'views/facet-widget.html',
        restrict: 'E',
        scope: {
            facetField: '@',
            label: '@',
            join: '@',
            isCollapsed: '@',
            alwaysOpen: '@',
            showPaginationControls: '@',
            limit: '@',
            sortBy: '@'
        },
        link: function postLink(scope, element, attrs) {
            // configure defaults for those optional attributes if not defined
            scope.ao = scope.alwaysOpen === undefined                         ? false : angular.fromJson(scope.alwaysOpen);
            scope.ic = scope.isCollapsed === undefined                       ? true  : angular.fromJson(scope.isCollapsed);
            scope.sp = scope.showPaginationControls === undefined ? true  : angular.fromJson(scope.showPaginationControls);
            scope.sb = scope.sortBy === undefined ? 'count' : scope.sortBy;
            scope.l = scope.limit === undefined ? false : angular.fromJson(scope.limit);

            // facet offset and begining page size
            scope.offset = 0;
            if (scope.sp === false) {
                scope.pageSize = -1;
            } else {
                scope.pageSize = 10;
            }
            var updateFacetCounts = function() {
                SolrService.updateFacetCount(scope.facetField, scope.offset, scope.pageSize, scope.sb);
            }

            // when we get a bootstrap message - init the filter
            scope.$on('app-ready', function() {
                updateFacetCounts();
            })
            scope.$on('update-all-facets', function() {
                updateFacetCounts();
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

                var f = [], pivotFields = [];
                try {
                    var filterModel = conf.facetFilter[scope.facetField].filterModel;
                    var filterPivot = conf.facetFilter[scope.facetField].pivotField;
                } catch (e) {
                    // do nothing
                }

                // if a pivotField and filterModel is defined we first construct
                //  a list containing only the subset of the defined pivotField
                if (filterModel !== undefined && filterPivot !== undefined) {
                    angular.forEach(SolrService.facets[filterPivot], function(v,k) {
                        if (v[2] == true) {
                            // it's a selected option
                            angular.forEach(filterModel[v[0]], function(i, j) {
                                pivotFields.push(i);
                            });
                        }
                    });
                }

                // iterate over the facet list as returned by solr and re - tick 
                //  anything that has been selected
                angular.forEach(SolrService.facets[scope.facetField], function(v,k) {
                    if (selected.indexOf(v[0]) !== -1) {
                        v[2] = true;
                        if (scope.startup === undefined) {
                            scope.ic = false;
                            scope.startup = false;
                        }
                    }
                    // also - if we're defining pivots and filters, only throw those
                    //  into the output mix otherwise send it all
                    if (filterModel !== undefined && filterPivot !== undefined) {
                        if (pivotFields.indexOf(v[0]) !== -1) {
                            f.push(v);
                        }
                    } else {
                        f.push(v);
                    }
                })

                // is pagination disabled and limiting on?
                if (scope.sp === false && scope.l === true && scope.allShowing !== true) {
                    scope.facetResults = f;
                    scope.facets = f.slice(0,3);
                } else {
                    scope.facets = f;
                }
            });

            // wipe clean if told to do so
            scope.$on('reset-all-filters', function() {
                angular.forEach(scope.facets, function(v,k) {
                    scope.facets[k][2] = false;
                })
                scope.selected = [];
            });

            // handle open / close broadcasts
            scope.$on('open-all-filters', function() {
                scope.ic = false;
            })
            scope.$on('close-all-filters', function() {
                scope.ic = true;
            })

            scope.reset = function() {
                scope.offset = 0;
                if (scope.sp === false) {
                    scope.pageSize = -1;
                } else {
                    scope.pageSize = 10;
                }
                SolrService.clearFilter(scope.facetField);
                updateFacetCounts();
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
                updateFacetCounts();
            }
            scope.pageBackward = function() {
                scope.offset = scope.offset - scope.pageSize;
                if (scope.offset < 0) { scope.offset = 0 };
                updateFacetCounts();
            }
            scope.updatePageSize = function() {
                if (scope.pageSize === null) { scope.pageSize = 10; }
                if (scope.pageSize > 1000) { scope.pageSize = 1000; }
                updateFacetCounts();
            }
            scope.showAll = function() {
                scope.facets = scope.facetResults;
                scope.allShowing = true;
            }
      }
    };
  }]);
