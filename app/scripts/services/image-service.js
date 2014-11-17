'use strict';

angular.module('searchApp')
  .service('ImageService', [ '$location', function ImageService($location) {

      function push(image_data) {
          ImageService.data = image_data;

          // save it to session storage
          sessionStorage.setItem('view', JSON.stringify(image_data));

          // then send us to the viewer
          $location.url('view');
      }

      function get() {
          if (ImageService.data === undefined) {
              var image_data = JSON.parse(sessionStorage.getItem('view'));
              ImageService.data = image_data;
          }
          return ImageService.data;
      }

      function drop(key) {
      }

      function isImage(source) {
          // acceptable image extensions - whatever we find will
          //  be lowercased so as to make this list a little shorter..
          var imageExts =  [ 'jpg', 'jpeg', 'png', 'gif' ];
          
          if (source === undefined) { 
              return false;
          } else {
              var ext = source.split('.').pop();
              if (ext !== undefined && imageExts.indexOf(ext.toLowerCase()) !== -1) {
                  return true;
              } else {
                  return false
              }
          }
      }
      
      var ImageService = {
          data: undefined,
          push: push,
          get: get,
          drop: drop,
          isImage: isImage
      }
      return ImageService;
  }]);
