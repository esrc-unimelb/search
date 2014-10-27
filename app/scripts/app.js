'use strict';

if (jQuery) {
var originalFn = $.fn.data;
  $.fn.data = function() {
    if (arguments[0] !== '$binding')
      return originalFn.apply(this, arguments);
  }
}

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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .when('/view', {
        templateUrl: 'views/image-view.html',
        controller: 'ImageViewCtrl'
      })
      .when('/:site', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
  });
