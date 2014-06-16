'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$window', '$routeParams', '$timeout', 'SolrService', 
     function ($rootScope, $scope, $window, $routeParams, $timeout, SolrService) {
      $scope.select = 'FACP';

      $scope.width = $window.innerWidth;
      $scope.height = $window.innerHeight;

      if (Object.keys($routeParams).length > 0) {
          $timeout(function() { $scope.ready = true; }, 1200);
      } else {
          $scope.ready = true;
      }

      $rootScope.$on('$locationChangeStart', function(e, n, c) {
          $scope.ready = false;
          SolrService.init(SolrService.deployment, SolrService.site);
      });
  }]);
