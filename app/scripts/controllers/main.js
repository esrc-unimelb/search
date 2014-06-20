'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$window', 'SolrService', function ($rootScope, $scope, $window, SolrService) {
      //$scope.select = 'FACP';

      $scope.w = $window.innerWidth;
      $scope.h = $window.innerHeight;

      if ($scope.w < 500) {
          $scope.t = 250;
      } else {
          $scope.t = 110;
      }

      $scope.lpw = Math.floor(($scope.w - 20) * 0.3) - 1;
      $scope.rpw = $scope.w - $scope.lpw - 1;

      /* handle summary / detail view toggle */
      $rootScope.$on('show-search-results-details', function() {
          $scope.detailsActive = false;
      });
      $rootScope.$on('hide-search-results-details', function() {
          $scope.detailsActive = true;
      });

      /* button methods */
      $scope.toggleDetails = function() {
          SolrService.toggleDetails();
      };

  }]);
