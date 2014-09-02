'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$window', '$routeParams', '$location', 'SolrService',
    function ($rootScope, $scope, $window, $routeParams, $location, SolrService) {
      if ($routeParams.site !== undefined) {
          $scope.select = $routeParams.site;
      } else {
          $scope.select = 'ESRC';
      }
      $scope.w = $window.innerWidth;
      $scope.h = $window.innerHeight;
      //console.log($scope.w, $scope.h);

      if ($scope.w < 760) {
          //window.location.replace('/basic-search');
          $scope.t = 85;
      } else {
          $scope.t = 85;
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
          if (SolrService.site === 'ESRC') {
              $scope.site_name = 'Search our data';
              $scope.site_url = $location.absUrl();
              $scope.returnToSiteLink = false;
          } else {
              $scope.site_name = 'Search: ' + SolrService.site_name;
              $scope.site_url = SolrService.site_url;
              $scope.returnToSiteLink = true;
          }
      })

      /* button methods */
      $scope.toggleDetails = function() {
          SolrService.toggleDetails();
      };

  }]);
