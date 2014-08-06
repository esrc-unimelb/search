'use strict';

/**
 * @ngdoc service
 * @name Configuration
 * @description
 *  Configuration object for the app.
 */
angular.module('searchApp')
  .constant('Configuration', {
      production:           'https://data.esrc.unimelb.edu.au/solr',
      testing:              'http://data.huni.net.au/solr',
      loglevel:             'DEBUG',
      allowedRouteParams:   [ 'q','type', 'function' ]
  });
