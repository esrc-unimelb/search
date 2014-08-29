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
      testing:              'https://data.esrc.info/solr',
      loglevel:             'DEBUG',
      allowedRouteParams:   [ 'q','type', 'function' ],
      defaultSite:          'ESRC'
  });
