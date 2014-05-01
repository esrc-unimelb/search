'use strict';

angular.module('searchApp')
  .directive('facetWidget', [ 'SolrService', function (SolrService) {
    return {
      templateUrl: 'views/facet-widget.html',
      restrict: 'E',
      scope: {
          deployment: '@',
          site: '@',
          loglevel: '@',
          facetField: '@'
      },
      link: function postLink(scope, element, attrs) {
        SolrService.init(scope.deployment, scope.site, scope.loglevel);
        SolrService.getFacet(scope.facetField).then(function(d) {
            var facets = d.data.facet_counts.facet_fields[scope.facetField];
            scope.facets = [];
            for (var i = 0; i < facets.length; i += 2) {
                scope.facets.push([facets[i], facets[i+1], false]);
            }
        });
        
        scope.add_facet = function(facet) {
            SolrService.addFacet(scope.facetField, facet);
            for (var i = 0; i < scope.facets.length; i++) {
                if (scope.facets[i][0] === facet) {
                    scope.facets[i][2] = true;
                }
            }
        }

        scope.remove_facet = function(facet) {
            SolrService.removeFacet(scope.facetField, facet);
            for (var i = 0; i < scope.facets.length; i++) {
                if (scope.facets[i][0] === facet) {
                    scope.facets[i][2] = false;
                }
            }
        }
      }
    };
  }]);
