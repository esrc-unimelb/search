'use strict';

/**
 * @ngdoc service
 * @name Configuration
 * @description
 *  Configuration object for the app.
 */
angular.module('searchApp')
  .constant('Configuration', {
      production:               'https://solr.esrc.unimelb.edu.au',
      testing:                  'https://data.esrc.info/solr',
      loglevel:                 'DEBUG',
      deployment:               'testing',
      allowedRouteParams:       [ 'q','type', 'function', 'level1', 'level2', 'dobject_type' ],
      site:                     'UMAB',
      keywordSearchOperator:    'AND',
      datasetStart:             '2000-01-01T00:00:00Z',
      datasetEnd:               '2014-12-31T23:59:59Z',

/*
      facetFilter: {
          'level2': {
              'pivotField': 'level1',
              'filterModel': {
                  'Old ABP building and pre-existing conditions':
                      [ 'Old ABP and Old Commerce buildings, external view', 'Old ABP and Old Commerce buildings, internal view', 
                        'Japanese Room', 'Japanese Room tile mural', 'Stairwell student works' ],
                  'Design competition':
                      [ 'Planning', 'Website', 'Entries', 'Shortlisting', 'Winner announcement' ],
                  'Design':
                      [ 'Schematic design', 'Detailed design', 'Contract documentation', 'Tender' ],
                  'Pre-construction':
                      [ 'Asbestos removal', 'Demolition', 'Enabling works', 'Hoardings and sheds', 'Joseph Reed Façade Works', 'Scaffolding', 'Timelapse camera locations', 'Tree Removal' ],
                  'Construction':
                      [ 'Images', 'Videos', 'Drawings', 'Documents', 'Data' ],
                  'Post-construction':
                      [ 'Images', 'Videos', 'Drawings', 'Documents', 'Data' ],
              }
          }
      }
*/

  });
