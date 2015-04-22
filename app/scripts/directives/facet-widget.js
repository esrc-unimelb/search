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
                // configure the width of the overlay based on the window size
                //  allowing enough room for the columns we want inside it. This means,
                //  the width has to be big enough to fit the columns at that window size
                var w;
                if ($window.innerWidth > 767 && $window.innerWidth < 991) {
                    w = '715px'; 
                } else if ($window.innerWidth > 992 && $window.innerWidth < 1199) {
                    w = '970px'; 
                } else if ($window.innerWidth > 1200) {
                    w = '1215px'; 
                }
                scope.smallList = false;
                scope.overlay = {
                    'position': 'relative',
                    'width': w,
                    'z-index': '20',
                    'background-color': 'white',
                    'border': '1px solid #ccc',
                    'box-shadow': '5px 5px 4px #888888',
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
