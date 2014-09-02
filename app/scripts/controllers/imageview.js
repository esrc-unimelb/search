'use strict';

angular.module('searchApp')
  .controller('ImageViewCtrl', [ '$scope', '$routeParams', '$window', '$location', 'ImageService',
     function ($scope, $routeParams, $window, $location, ImageService) {

        $scope.showLoadingIndicator = true;
        $scope.showImage = null;

        $scope.data = ImageService.get($routeParams.imageid);

        var w = angular.element($window);
        w.bind('resize', function() {
            $scope.$apply(function() {
              sizeThePanels();
            })
        });

        var sizeThePanels = function() {
            $scope.height = $window.innerHeight;
            $scope.width = $window.innerWidth;
            $scope.image_pane_height = $window.innerHeight * 0.9;
            $scope.image_label_height = $window.innerHeight - $scope.image_pane_height;
        }
        sizeThePanels();
        //if ($scope.data === undefined) { 
        //    $location.url('/'); 
        //}
        console.log($scope.data);
        /*
        $scope.data = {
            id: 'https://web.esrc.unimelb.edu.au/UMABt/objects/D00000027.htm',
            name: 'Construction - Glazed atrium roof - Delivery and installation',
            fullsize: 'https://web.esrc.unimelb.edu.au/UMABt/objects/images/DSC_5177 Construction - Roof folders - Glazed atrium roof - Delivery and installation.JPG',
            site_name: 'Architecture Building Archive',
            site_url: 'http://web.esrc.unimelb.edu.au/UMABt'
        }
        */

        var img = new Image();
        img.onload = function() {
            $scope.$apply(function() {
                $scope.showLoadingIndicator = null;
                $scope.showImage = true;
                $scope.showDetails = true;
            })
        }
        img.src = $scope.data.fullsize;

        $scope.back = function() {
            $window.history.back();
        }

  }]);
