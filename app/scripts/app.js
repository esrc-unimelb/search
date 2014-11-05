'use strict';

angular.module('searchApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'nvd3ChartDirectives',
  'mgcrea.ngStrap',
  'ngAnimate'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/about.html',
        controller: '',
      })
      .when('/view', {
        templateUrl: 'views/image-view.html',
        controller: 'ImageViewCtrl'
      })
      .when('/app', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
  });
