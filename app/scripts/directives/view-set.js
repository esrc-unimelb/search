'use strict';

angular.module('searchApp')
  .directive('viewSet', [ '$window', '$location', '$anchorScroll', '$timeout', 'ImageService', 
        function ($window, $location, $anchorScroll, $timeout, ImageService) {
    return {
      templateUrl: 'views/view-set.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {

          // defaults
          scope.showFilmstrip = true;
          scope.showInformation = false;

          // get the data
          scope.data = ImageService.get();

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
                scope.loadImage(scope.current);
              })
          });

          var sizeThePanels = function() {
              scope.height = $window.innerHeight;
              scope.width = $window.innerWidth;
              scope.navbar_height = 50;
              if (scope.showFilmstrip === true) {
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height) * 0.80;
                  scope.filmstrip_height = $window.innerHeight - scope.navbar_height - scope.image_pane_height;
                  scope.image_height = scope.filmstrip_height * 0.9;
              } else {
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height);
              }
          }
          sizeThePanels();

          scope.smallImages = [];
          scope.largeImageMap = {};
          scope.styleMap = {};
          scope.largeImageById = [];

          // create our map from id to large image
          angular.forEach(scope.data.large_images, function(v, k) {
              var c = v.split('_');
              scope.largeImageMap[c[1]] = scope.data.source + '/images/' + scope.data.item_id + '/large/' + v;
              scope.styleMap[c[1]] = '';
              scope.largeImageById.push(c[1]);
          });

          // construct the data structure for the filmstrip
          angular.forEach(scope.data.small_images, function(v, k) {
              scope.smallImages.push(
                  { 
                    'id': v.split('_')[1],
                    'src': scope.data.source + '/images/' + scope.data.item_id + '/small/' + v,
                  }
              );
          });

          // handle an image selection
          scope.loadImage = function(id) {
              scope.show = false;
              scope.styleMap[scope.current] = '';
              scope.styleMap[id] = 'highlight-current';
              scope.image = scope.largeImageMap[id];
              scope.current = id;
              scope.displaying = (scope.largeImageById.indexOf(scope.current) + 1) + ' of ' + scope.largeImageById.length;

              // scroll the thumbnails
              var old = $location.hash();
              $location.hash(id);
              $anchorScroll();
              $location.hash(old);
              $timeout(function() { scope.show = true; }, 100);

              // toggle the pagindation controls
              if (scope.largeImageById.indexOf(scope.current) == 0) {
                  // show next not previous
                  scope.showNext = true;
                  scope.showPrevious = false;
              } else if (scope.largeImageById.indexOf(scope.current) == scope.largeImageById.length -1) {
                  // show previous not next
                  scope.showNext = false;
                  scope.showPrevious = true;
              } else {
                  // show both
                  scope.showNext = true;
                  scope.showPrevious = true;
              }
          }

          // load the first in the set
          var i = scope.data.large_images[0];
          scope.current = i.split('_')[1];
          scope.loadImage(scope.current);

          // page to next image
          scope.next = function() {
              var i = scope.largeImageById.indexOf(scope.current);
              if (i < scope.largeImageById.length -1) {
                var n = scope.largeImageById[i + 1];
                scope.loadImage(n);
              }
          }
          // page to previous image
          scope.previous = function() {
              var i = scope.largeImageById.indexOf(scope.current);
              if (i > 0) {
                  var p = scope.largeImageById[i - 1];
                  scope.loadImage(p);
              }
          }

          // jump to first image
          scope.jumpToStart = function( ){
              var i = scope.largeImageById[0];
              scope.loadImage(i);
          }

          // jump to last image
          scope.jumpToEnd = function( ){
              var i = scope.largeImageById[scope.largeImageById.length - 1];
              scope.loadImage(i);
          }
          
          // toggle the filmstrip view
          scope.toggleFilmstrip = function() {
              scope.showFilmstrip = !scope.showFilmstrip;
              sizeThePanels();
          }

          // show the item information panel
          scope.toggleInformation = function() {
              scope.showInformation = !scope.showInformation;
          }

      }
    };
  }]);
