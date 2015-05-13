'use strict';

angular.module('searchApp')
  .directive('viewSet', [ '$log', '$window', '$location', '$anchorScroll', '$timeout',  
        function ($log, $window, $location, $anchorScroll, $timeout) {
    return {
      templateUrl: 'views/view-set.html',
      restrict: 'E',
      scope: {
          imageSetData: '='
      },
      link: function postLink(scope, element, attrs) {
          // defaults
          scope.showImageSet = false;
          scope.showFilmstrip = false;

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
              })
          });

          var sizeThePanels = function() {
              scope.height = $window.innerHeight;
              scope.width = $window.innerWidth;
              scope.navbarHeight = 50;
              scope.panelHeight = $window.innerHeight * 0.92;
              scope.imagePaneHeight = scope.panelHeight - scope.navbarHeight - 100;

              if (scope.showFilmstrip === true) {
                  scope.filmstripHeight = 250;
                  scope.imagePaneHeight = scope.panelHeight - scope.navbarHeight - scope.filmstripHeight;
                  scope.imageHeight = scope.filmstripHeight - 20;
              }
          }

          scope.$watch('imageSetData', function() {
              if (!_.isEmpty(scope.imageSetData)) {
                  //$log.debug('D:view-set; image-set data', scope.imageSetData);
                  $location.hash('view');

                  // figure out sizes
                  scope.showFilmstrip = false;
                  sizeThePanels();
                  
                  // load up the image
                  scope.current = 0;
                  scope.loadImage();

                  // set the viewer to visible
                  scope.showImageSet = true;
              }
          });

          // we need to intercept the locationChangeStart event
          //  and call close when the new url does not have #view
          //  in it. That is, an image is displayed and the user
          //  has pressed the back button.
          scope.$on('$locationChangeStart', function(e, n, o) {
              if (!n.match('#view')) {
                  scope.imageSetData = null;
                  scope.showImageSet = false;
              }
          });

          // handler to shut it all down
          scope.close = function() {
              $window.history.back();
          }

          scope.loadImage = function() {
              scope.image = scope.imageSetData.source + '/images/' + scope.imageSetData.item_id + '/large/' + scope.imageSetData.large_images[scope.current];
              scope.figureOutPaginationControls();
              scope.highlightThumbnail();
          }

          scope.figureOutPaginationControls = function() {
              // toggle the pagination controls
              if (scope.current === 0) {
                  // show next not previous
                  scope.showNext = true;
                  scope.showPrevious = false;
              } else if (scope.current === scope.imageSetData.large_images.length -1) {
                  // show previous not next
                  scope.showNext = false;
                  scope.showPrevious = true;
              } else {
                  // show both
                  scope.showNext = true;
                  scope.showPrevious = true;
              }
          }

          // page to next image
          scope.next = function() {
              scope.current += 1;
              if (scope.current === scope.imageSetData.large_images.length -1) scope.current = scope.imageSetData.large_images.length -1;
              scope.loadImage();
          }
          // page to previous image
          scope.previous = function() {
              scope.current -= 1;
              if (scope.current === 0) scope.current = 0;
              scope.loadImage();
          }

          // jump to first image
          scope.jumpToStart = function(){
              scope.current = 0;
              scope.loadImage();
          }

          // jump to last image
          scope.jumpToEnd = function(){
              scope.current = scope.imageSetData.large_images.length -1;
              scope.loadImage();
          }
          
          // highlight thumbnail
          scope.highlightThumbnail = function() {
              _.each(scope.smallImages, function(d, i) {
                  d.selected = '';
                  if (i === scope.current) d.selected = 'filmstrip-highlight-current';
              })
              scope.scrollThumbnails();
          }


          // toggle the filmstrip view
          scope.toggleFilmstrip = function() {
              scope.showFilmstrip = !scope.showFilmstrip;
              scope.smallImages = _.map(scope.imageSetData.small_images, function(d, i) { 
                  var selected = '';
                  if (i === scope.current) selected = 'filmstrip-highlight-current'; 
                  return {
                      'id': i,
                      'source': scope.imageSetData.source + '/images/' + scope.imageSetData.item_id + '/small/' + d,
                      'selected': selected
                  }
              });
              sizeThePanels();
              $timeout(function() {
                  scope.scrollThumbnails();
              }, 100);
          }

          scope.jumpToPage = function(i) {
              scope.current = i;
              scope.loadImage();
          }

          scope.scrollThumbnails = function() {
              // scroll the thumbnails
              var old = $location.hash();
              $location.hash(scope.current);
              $anchorScroll();
              $location.hash(old);
          }

      }
    };
  }]);
