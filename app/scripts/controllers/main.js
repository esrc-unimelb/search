'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$scope', '$window', '$routeParams', '$location', 'SolrService',
    function ($scope, $window, $routeParams, $location, SolrService) {
      if ($routeParams.site !== undefined) {
          $scope.site = $routeParams.site;
      } else {
          $scope.site = 'ESRC';
      }

      $scope.w = $window.innerWidth;
      $scope.h = $window.innerHeight;
      //console.log($scope.w, $scope.h);

      if ($scope.w < 760) {
          //window.location.replace('/basic-search');
          $scope.t = 152;
      } else {
          $scope.t = 152;
      }

      // left (lpw) and right (rpw) panel widths
      $scope.lpw = Math.floor(($scope.w) * 0.3) - 1;
      $scope.rpw = $scope.w - $scope.lpw - 1;

      /* handle summary / detail view toggle */
      $scope.$on('show-search-results-details', function() {
          $scope.detailsActive = false;
      });
      $scope.$on('hide-search-results-details', function() {
          $scope.detailsActive = true;
      });
      $scope.$on('site-name-retrieved', function() {
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
