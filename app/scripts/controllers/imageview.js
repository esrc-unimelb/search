'use strict';

angular.module('searchApp')
  .controller('ImageViewCtrl', [ '$scope', '$routeParams', '$window', '$location', 'ImageService',
     function ($scope, $routeParams, $window, $location, ImageService) {

        $scope.showLoadingIndicator = true;
        $scope.showImage = null;

        $scope.data = ImageService.get($routeParams.imageid);
        if ($scope.data === undefined) { 
            $location.url('/'); 
        }
        console.log($scope.data);

        $scope.image_pane_height = $window.innerHeight * 0.9;
        $scope.image_label_height = $window.innerHeight - $scope.image_pane_height;

        var img = new Image();
        img.onload = function() {
            $scope.$apply(function() {
                $scope.showLoadingIndicator = null;
                $scope.showImage = true;
            })
        }
        img.src = $scope.data.fullsize;

  }]);
