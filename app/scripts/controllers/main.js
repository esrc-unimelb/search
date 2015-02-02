'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$window', '$location', 'SolrService',
    function ($rootScope, $scope, $window, $location, SolrService) {
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
              var site = $window.location.hash.split('/')[1];
              var newLocation; 
              if (site !== '') {
                $window.location.replace('/basic-search/#/' + site);
              } else {
                $window.location.replace('/basic-search');
              }
          } else {
              $scope.t = 168;
          }

          // left (lpw) and right (rpw) panel widths
          if ($scope.w < 1050) {
              $scope.lpw = Math.floor(($scope.w) * 0.35) - 1;
              $scope.rpw = $scope.w - $scope.lpw - 1;
          } else {
              $scope.lpw = Math.floor(($scope.w) * 0.25) - 1;
              $scope.rpw = $scope.w - $scope.lpw - 1;
          }

          $scope.topbarStyle = {
              'position': 'fixed',
              'top':      '0px',
              'width':    '100%',
              'z-index':  '10000',
              'padding':  '0px 10px'
          }
          $scope.sidebarStyle = {
              'position':         'absolute',
              'top':              $scope.t + 'px',
              'left':             '0px',
              'width':            $scope.lpw + 'px',
              'height':           $scope.h -$scope.t + 'px',
              'overflow-y':       'scroll',
              'padding':          '5px 15px',
              'background-color': '#efefea'
          }
          $scope.bodypanelStyle = {
              'position':     'absolute',
              'top':          $scope.t + 'px',
              'left':         $scope.lpw + 'px',
              'width':        $scope.rpw + 'px',
              'height':       $scope.h - $scope.t + 'px',
              'overflow-y':   'scroll',
              'padding':      '0px 15px'
          }
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
              $scope.site_name = 'Search the datasets.';
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

      $scope.clearAllFilters = function() {
        SolrService.clearAllFilters();
      };
      $scope.openAllFilters = function() {
          $rootScope.$broadcast('open-all-filters');
      }
      $scope.closeAllFilters = function() {
          $rootScope.$broadcast('close-all-filters');
      }

  }]);
