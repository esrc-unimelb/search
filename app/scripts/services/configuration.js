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
      deployment:               'production',
      allowedRouteParams:       [ 'q' ],
      site:                     'ISISrecords',
      keywordSearchOperator:    'AND',
      datasetStart:             '0001-01-01T00:00:00Z',
      datasetEnd:               '2014-12-31T23:59:59Z',

      searchFields: {
          '1': { 'fieldName': 'author_search',         'displayName': 'Authors',         'weight': '1' },
          '2': { 'fieldName': 'editor_search',         'displayName': 'Editors',         'weight': '1' },
          '3': { 'fieldName': 'contributor_search',    'displayName': 'Contributors',    'weight': '1' },
          '4': { 'fieldName': 'title_search',          'displayName': 'Title',           'weight': '1' },
          '5': { 'fieldName': 'publisher_search',      'displayName': 'Publisher',       'weight': '1' },
          '6': { 'fieldName': 'subject_topic_search',  'displayName': 'Subject: topic',  'weight': '1' },
          '7': { 'fieldName': 'subject_personal_search', 'displayName': 'Subject: person', 'weight': '1' }
      }

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
                      [ 'Schematic design', 'Detailed design', 'Construction documentation', 'Tender' ],
                  'Pre-construction':
                      [ 'Asbestos removal', 'Demolition', 'Enabling works', 'Hoardings and sheds', 'Joseph Reed Façade Works', 'Scaffolding', 'Timelapse camera locations', 'Tree Removal' ],
                  'Construction':
                      [ 'Images', 'Videos', 'Drawings', 'Documents', 'Data' ],
                  'Post-construction':
                      [ 'Images', 'Videos', 'Drawings', 'Documents', 'Data' ],
              }
          },
          'level3': {
              'pivotField': 'level2',
              'filterModel': {
                  'Planning':
                    [ 'Competition outline', 'Briefing session', 'Competition questions', 'Competition email correspondence', 'Jury meeting minutes', 'Competition publicity' ],
                  'Website':
                    [ 'Include linke to competition website' ],
                  'Entries': 
                    [ 'Eligible', 'Failed to address selection criteria', 'Non-conforming', 'Additional' ],
                  'Shortlisting':
                    [ 'Submissions', 'Presentations' ],
                  'Schematic design':
                    [ 'Card models', 'Sketches', 'Webex', 'Drawings', 'Documents' ],
                  'Detailed design':
                    [ 'Card models', 'Renders', 'Sketches', 'Drawings', 'Documents' ],
                  'Construction documentation':
                    [ 'Card models', 'Renders', 'Sketches', 'Webex', 'Drawings', 'Documents' ],
                  'Tender':
                    [ 'Drawings', 'Documents' ]
                  
              }
          }
      }
*/

  });
