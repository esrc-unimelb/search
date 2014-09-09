'use strict';

angular.module('searchApp')
  .controller('ImageViewCtrl', [ '$scope', 'ImageService',
     function ($scope, ImageService) {

        // get the data back and load up the appropriate viewer
        var data = ImageService.get();
        if (data.data_type === 'OHRM') {
            $scope.single = true;
        } else {
            $scope.set = true;
        }

  }]);
