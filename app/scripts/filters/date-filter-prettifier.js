'use strict';

angular.module('searchApp')
  .filter('dateFilterPrettifier', function () {
    return function (input) {
        var s = input.replace(/-01-01T/g, '').replace(/-12-31T/g, '');
        s = s.replace(/00:00:00Z/g, '').replace(/23:59:59Z/g, '');
        return s;
    };
  });
