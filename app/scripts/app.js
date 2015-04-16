'use strict';

angular.module('searchApp', [
  'ngCookies',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
      })
      .when('/:site', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
      })
      .when('/embed', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
      })
      .when('/view', {
        templateUrl: 'views/image-view.html',
        controller: 'ImageViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      // enable html5 mode
      $locationProvider.html5Mode(true).hashPrefix('!');

  });
