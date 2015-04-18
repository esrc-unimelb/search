'use strict';

angular.module('searchApp')
  .directive('gridView', [ 'SolrService', 'ImageService', '$window', function (SolrService, ImageService, $window) {
    return {
      templateUrl: 'views/grid-view.html',
      restrict: 'E',
      scope: {
          'docs': '='
      },
      link: function postLink(scope, element, attrs) {
          scope.$watch('docs', function() {
              var images = _.map(scope.docs, function(d) { d.isImage = ImageService.isImage(d.fullsize); return d });
              scope.images = [];
              scope.images.push(images.slice(0,3));
              scope.images.push(images.slice(3,6));
              scope.images.push(images.slice(6,9));
              scope.images.push(images.slice(9,12));
          }, true);

          scope.view = function(data) {
              scope.imageData = data;
          }

      }
    };
  }]);
