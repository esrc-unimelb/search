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
      .when('/:site?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
      })
      .when('/embed', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false,
      })
      .when('/basic/search', {
        templateUrl: 'views/basic-search.html',
        controller: 'BasicSearchCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });

      // enable html5 mode
      //$locationProvider.html5Mode(true).hashPrefix('!');

  });
