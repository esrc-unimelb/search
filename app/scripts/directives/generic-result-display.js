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
  .directive('genericResultDisplay', [ '$log', 'SolrService', function ($log, SolrService) {
    return {
      templateUrl: 'views/generic-result-display.html',
      restrict: 'E',
      scope: {
          'data': '=ngModel',
      },
      link: function postLink(scope, element, attrs) {
          scope.showProvenance = false;
          scope.networkView = false;
          scope.imageSet = false;

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

          // is this an entity that can be visualised by connex?
          if (scope.data.data_type === 'OHRM') { 
            if (scope.data.main_type === undefined) {
              if (_.has(SolrService.configuration.connexSites, scope.data.site_code)) { 
                  if (!SolrService.configuration.disableConnex) {
                    if (scope.data.type !== 'Text') scope.networkView = true;
                  }
              }
            }
          }

          scope.viewImageSet = function() {
              scope.imageSetData = scope.data;
          }
          scope.viewNetwork = function() {
              scope.networkData = scope.data;
          }
      }
    };
  }]);
