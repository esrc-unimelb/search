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
      deployment:           'testing',
      allowedRouteParams:   [ 'q','type', 'function' ],
      site:                 'ESRC',
      datasetStart:         '1600-01-01T00:00:00Z',
      datasetEnd:           '2014-12-31T23:59:59Z'
  });
