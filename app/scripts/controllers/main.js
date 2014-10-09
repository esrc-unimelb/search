'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$scope', '$window', 'SolrService',
    function ($scope, $window, SolrService) {
      var w = angular.element($window);
      w.bind('resize', function() {
          $scope.$apply(function() {
            sizeThePanels();
          })
      });

      var sizeThePanels = function() {
          $scope.w = $window.innerWidth;
          $scope.h = $window.innerHeight;
          //console.log($scope.w, $scope.h);

          if ($scope.w < 760) {
              $scope.t = 100;
/*
              var site = $window.location.hash.split('/')[1];
              var newLocation; 
              if (site !== '') {
                $window.location.replace('/basic-search/' + site);
              } else {
                $window.location.replace('/basic-search');
              }
*/
          } else {
              $scope.t = 100;
          }

          // left (lpw) and right (rpw) panel widths
          $scope.lpw = Math.floor(($scope.w) * 0.3) - 1;
          $scope.rpw = $scope.w - $scope.lpw - 1;
      }
      sizeThePanels();

      /* handle summary / detail view toggle */
      $scope.$on('show-search-results-details', function() {
          $scope.detailsActive = false;
      });
      $scope.$on('hide-search-results-details', function() {
          $scope.detailsActive = true;
      });
      $scope.$on('site-name-retrieved', function() {
          if (SolrService.site === 'ESRC') {
              $scope.site_name = undefined;
              $scope.site_url = undefined;
          } else {
              $scope.site_name = SolrService.site_name;
              $scope.site_url = SolrService.site_url;
          }
      })

      /* button methods */
      $scope.toggleDetails = function() {
          SolrService.toggleDetails();
      };

  }]);
