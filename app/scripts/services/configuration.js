'use strict';

/**
 * @ngdoc service
 * @name Configuration
 * @description
 *  Configuration object for the app.
 */
angular.module('searchApp')
  .constant('Configuration', {
      production:           'https://solr.esrc.unimelb.edu.au',
      testing:              'https://data.esrc.info/solr',
      loglevel:             'DEBUG',
      deployment:           'production',
      allowedRouteParams:   [ 'q','type', 'function' ],
      site:                 'ESRC'
  });
