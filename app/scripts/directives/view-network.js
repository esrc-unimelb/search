'use strict';

/**
 * @ngdoc directive
 * @name searchApp.directive:viewNetwork
 * @description
 * # viewNetwork
 */
angular.module('searchApp')
  .directive('viewNetwork', [ '$log', '$location', '$window', '$sce', 'SolrService', 
        function ($log, $location, $window, $sce, SolrService) {
    return {
      templateUrl: 'views/view-network.html',
      restrict: 'E',
      scope: {
          networkData: '=',
      },
      link: function postLink(scope, element, attrs) {
          // as the directive is injected on page load
          //   ensure the content doesn't get loaded
          scope.showNetwork = false;

          // when the parent scope has set the data to show
          //  that is - an image has been clicked
          //  show the content
          scope.$watch('networkData', function() {
              if (!_.isEmpty(scope.networkData)) {
                // console.log('***', scope.networkData);
                $location.hash('view');
                scope.showNetwork = true;
                //scope.link = https://connex.esrc.unimelb.edu.au/#/entity/ASMP/E000162?link=false
                scope.link = $sce.trustAsResourceUrl(SolrService.configuration.connex + '/' + scope.networkData.site_code + '/' + 
                    scope.networkData.record_id + '?link=false')
              }
          }, true);

          // we need to intercept the locationChangeStart event
          //  and call close when the new url does not have #view
          //  in it. That is, an image is displayed and the user
          //  has pressed the back button.
          scope.$on('$locationChangeStart', function(e, n, o) {
              if (!n.match('#view')) {
                  scope.networkData = null;
                  scope.showNetwork = false;
              }
          });

          // handler to shut it all down
          scope.close = function() {
              $window.history.back();
          }
      }
    };
  }]);
