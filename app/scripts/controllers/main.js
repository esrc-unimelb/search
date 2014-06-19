'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$window', 'SolrService', function ($rootScope, $scope, $window, SolrService) {
      $scope.select = 'FACP';

      $scope.width = $window.innerWidth;
      $scope.height = $window.innerHeight;

      if ($scope.width < 500) {
          $scope.top = 250;
      } else {
          $scope.top = 110;
      }

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
