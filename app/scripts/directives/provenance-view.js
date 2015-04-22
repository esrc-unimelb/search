'use strict';

angular.module('searchApp')
  .directive('provenanceView', [ 'SolrService', function (SolrService) {
    return {
      templateUrl: 'views/provenance-view.html',
      restrict: 'E',
      scope: {
          'data': '=',
      },
      link: function postLink(scope, element, attrs) {
          scope.showSolrSource = false;
          if (SolrService.configuration.debug) {
              scope.link = SolrService.query.solr + '?q=id:"' + scope.data.id + '"&spellcheck=off';
              scope.showSolrSource = true;
          }
      }
    };
  }]);
