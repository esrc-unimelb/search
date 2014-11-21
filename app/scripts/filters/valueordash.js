'use strict';

angular.module('searchApp')
  .filter('valueOrDash', function () {
    return function (input) {
        if (input === undefined) {
            return '-';
        } else {
            return input;
        }
    };
  });
