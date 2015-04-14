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
  .directive('facetWidget', [ '$window', 'SolrService', 'Configuration', 
        function ($window, SolrService, conf) {
    return {
        templateUrl: 'views/facet-widget.html',
        restrict: 'E',
        scope: {
            facetField: '@',
            label: '@',
            join: '@',
            isCollapsed: '@',
            alwaysOpen: '@',
        },
        link: function postLink(scope, element, attrs) {
            // configure defaults for those optional attributes if not defined
            scope.ic                                        = _.isUndefined(scope.isCollapsed) ? true  : angular.fromJson(scope.isCollapsed);
            scope.ao                                        = _.isUndefined(scope.alwaysOpen)  ? false : angular.fromJson(scope.alwaysOpen);
            SolrService.query.filterUnion[scope.facetField] = _.isUndefined(scope.join)        ? 'OR'  : scope.join;
            scope.smallList = true;

            var updateFacetCounts = function() {
                SolrService.updateFacetCount(scope.facetField);
            }

            scope.$on('update-all-facets', function() {
                updateFacetCounts();
            })

            // when we get an update event from the solr
            //  service - rejig the widget as required
            scope.$on(scope.facetField+'-facets-updated', function() {
                var selected = SolrService.query.filters[scope.facetField];

                var facetData = _.map(SolrService.query.facets[scope.facetField], function(d) {
                    d.checked = false;
                    if (_.contains(selected, d.name)) { 
                        d.checked = true;
                        scope.ic = false;
                    }
                    return d;
                });

                scope.smallFacetList = facetData.slice(0,5);
                scope.largeFacetList = [];
                scope.largeFacetList.push(facetData.slice(0,15));
                scope.largeFacetList.push(facetData.slice(16,30));
                scope.largeFacetList.push(facetData.slice(31,45));
            });

            // handle open / close broadcasts
            scope.$on('open-all-filters', function() {
                scope.ic = false;
            })
            scope.$on('close-all-filters', function() {
                scope.ic = true;
            })

            // apply the clicked facet
            scope.facet = function(facet) {
                SolrService.filterQuery(scope.facetField, facet);
            };

            // show the expanded panel
            scope.showMore = function() {
                scope.smallList = false;
                scope.overlay = {
                    'position': 'relative',
                    'width': $window.innerWidth - 60,
                    'z-index': '20',
                    'background-color': 'white',
                    'border': '1px solid grey',
                    'border-radius': '8px',
                    'padding': '15px'
                }
                scope.underlay = {
                    'position': 'fixed',
                    'top': '0px',
                    'left': '0px',
                    'width': $window.innerWidth,
                    'height': $window.innerHeight,
                    'background-color': '#ccc',
                    'z-index': '10',
                    'opacity': 0.3
                }
            }

            // close the expanded panel
            scope.close = function() {
                scope.smallList = true;
            }

            // clear all the selections
            scope.clearAll = function() {
                delete SolrService.query.filters[scope.facetField];
                SolrService.search();
            }

            // initialise the widget
            updateFacetCounts();

      }
    };
  }]);
