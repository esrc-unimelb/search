'use strict';

/**
 * @ngdoc directive
 * @name generic-result-display
 * @restrict E
 * @scope
 * @description
 *  A UI control for displaying a search result.
 *
 * @param {expression} data - The result data.
 */
angular.module('searchApp')
  .directive('genericResultDisplay', [ '$rootScope', '$location', 'SolrService', 'ImageService', 
    function ($rootScope, $location, SolrService, ImageService) {
    return {
      templateUrl: 'views/generic-result-display.html',
      restrict: 'E',
      scope: {
          'data': '=ngModel',
      },
      link: function postLink(scope, element, attrs) {
          scope.showImage = false;
          scope.showProvenance = false;

          // determine the source url to use for the record
          if (scope.data.display_url !== undefined) {
              scope.data.reference = scope.data.display_url;
          } else {
              scope.data.reference = scope.data.id;
          }

          // is this a finding aid item with an image set attached?
          if (scope.data.type === 'Finding Aid Item' && scope.data.large_images !== undefined) {
            scope.imageSet = true;
            scope.imageCount = scope.data.small_images.length;
          }

          scope.view = function() {
          }
      }
    };
  }]);
