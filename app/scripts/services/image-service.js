'use strict';

angular.module('searchApp')
  .service('ImageService', function ImageService() {

      function push(image_data) {
          var key = Math.random().toString(36).slice(2);
          ImageService.set[key] = image_data;
          ImageService.current = key;

          // and save it to session storage
          sessionStorage.setItem('view', JSON.stringify(image_data));
      }

      function get() {
          if (ImageService.current === undefined) {
              var image_data = JSON.parse(sessionStorage.getItem('view'));
              ImageService.push(image_data);
          }
          return ImageService.set[ImageService.current];
      }

      function drop(key) {
      }

      
      var ImageService = {
          set: {},
          push: push,
          get: get,
          drop: drop
      }
      return ImageService;
  });
