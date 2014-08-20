'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$window', '$routeParams', 'SolrService',
    function ($rootScope, $scope, $window, $routeParams, SolrService) {
      if ($routeParams.site !== undefined) {
          $scope.select = $routeParams.site;
      }
      $scope.w = $window.innerWidth;
      $scope.h = $window.innerHeight;
      //console.log($scope.w, $scope.h);

      if ($scope.w < 1024) {
          window.location.replace('/basic-search');
      } else {
          $scope.t = 165;
      }
      // panel padding
      $scope.padding = 15;

      // left (lpw) and right (rpw) panel widths
      $scope.lpw = Math.floor(($scope.w - 20) * 0.25) - $scope.padding;
      $scope.rpw = $scope.w - $scope.lpw - $scope.padding;

      /* handle summary / detail view toggle */
      $rootScope.$on('show-search-results-details', function() {
          $scope.detailsActive = false;
      });
      $rootScope.$on('hide-search-results-details', function() {
          $scope.detailsActive = true;
      });
      $rootScope.$on('site-name-retrieved', function() {
          $scope.site_name = SolrService.site_name;
      })

      /* button methods */
      $scope.toggleDetails = function() {
          SolrService.toggleDetails();
      };

  }]);
