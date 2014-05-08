'use strict';

angular.module('searchApp')
  .constant('Configuration', {
      production: 'https://data.esrc.unimelb.edu.au/solr',
      testing:    'https://data.esrc.info/solr',
      loglevel:   'DEBUG'
  });
