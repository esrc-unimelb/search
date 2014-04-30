'use strict';

angular.module('searchApp')
  .directive('basicSearch', [ 'SolrService', function (SolrService) {
    return {
      templateUrl: 'views/basic-search.html',
      restrict: 'E',
      scope: {
          help: '@',
          deployment: '@',
          site: '@',
          loglevel: '@'
      },
      link: function postLink(scope, element, attrs) {
          scope.init = function() {
          }

          scope.search = function() {
              if (scope.search_box === undefined || scope.search_box === '') {
                  scope.search_box = '*';
              }
              SolrService.init(scope.deployment, scope.site, scope.loglevel);
              SolrService.search(scope.search_box, 0).then(function(d) {
                  SolrService.saveData(d);
              });
          }


      }
    };
  }]);
