'use strict';

angular.module('searchApp')
  .controller('MainCtrl', [ '$rootScope', '$scope', '$window', function ($rootScope, $scope, $window) {
      //$scope.select = 'FACP';

      $scope.width = $window.innerWidth;
      $scope.height = $window.innerHeight;

/*
      $rootScope.$on('app-ready', function() {
          $scope.ready = true;
      });
*/

  }]);
