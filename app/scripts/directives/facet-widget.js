'use strict';

angular.module('searchApp')
  .directive('facetWidget', [ 'SolrService', function (SolrService) {
    return {
        templateUrl: 'views/facet-widget.html',
        restrict: 'E',
        scope: {
            facetField: '@',
            label: '@'
        },
        link: function postLink(scope, element, attrs) {
            SolrService.getFacet(scope.facetField).then(function(d) {
                var facets = d.data.facet_counts.facet_fields[scope.facetField];
                scope.facets = [];
                for (var i = 0; i < facets.length; i += 2) {
                    scope.facets.push(facets[i]);
                }
           });
        
            scope.facet = function(facet) {
                SolrService.facet(scope.facetField, facet);
                for (var i = 0; i < scope.facets.length; i++) {
                    if (scope.facets[i][0] === facet) {
                        scope.facets[i][2] = true;
                    }
                }
            }

      }
    };
  }]);
