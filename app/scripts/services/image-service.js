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

      
      var ImageService = {
          data: undefined,
          push: push,
          get: get,
          drop: drop
      }
      return ImageService;
  }]);
