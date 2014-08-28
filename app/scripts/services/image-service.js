'use strict';

angular.module('searchApp')
  .service('ImageService', function ImageService() {

      function push(image_data) {
          var key = Math.random().toString(36).slice(2);
          ImageService.set[key] = image_data;
          return key
      }

      function get(key) {
          return ImageService.set[key];
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
