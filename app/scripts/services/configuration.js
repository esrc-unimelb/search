'use strict';

/**
 * @ngdoc service
 * @name Configuration
 * @description
 *  Configuration object for the app.
 */
angular.module('searchApp')
  .constant('Configuration', {
      "debug":                    true,
      "production":               "https://solr.esrc.unimelb.edu.au",
      "testing":                  "https://data.esrc.info/solr",
      "deployment":               "production",
      "connex":                   "https://connex.esrc.unimelb.edu.au/#/entity",
      "connexBackend":            "https://cnex.esrc.unimelb.edu.au",
      "disableConnex":            false,
      "site":                     "ESRC",
      "searchType":               "keyword",
      "searchTypeKeywordUnion":   "AND",
      "datasetStart":             "1600-01-01T00:00:00Z",
      "datasetEnd":               "2014-12-31T23:59:59Z",

      "searchFields": {
          "name":        { "fieldName": "name",           "displayName": "Entity Name",           "weight": "100" },
          "altname":     { "fieldName": "altname",        "displayName": "Entity Alternate Name", "weight": "50" },
          "locality":    { "fieldName": "locality",       "displayName": "Locality",              "weight": "30" },
          "text":        { "fieldName": "text",           "displayName": "Entity Content",        "weight": "10" },
          "description": { "fieldName": "description",    "displayName": "Resource Content",      "weight": "1" }
      },

      "facetWidgets": [
          { "facetField": "site_name",  "label": "Site",            "join": "OR" },
          { "facetField": "type",       "label": "Entity Type",     "join": "OR" },
          { "facetField": "function",   "label": "Entity Function", "join": "AND" },
          { "facetField": "repository", "label": "Repository",      "join": "OR" },
          { "facetField": "tag",        "label": "Tag",             "join": "AND" }
      ],

      "dateFacetWidgets": [
          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "1", 
            "label": "Age of Discovery: 1400 - 1699", "start": "1400", "end": "1699", "interval": "50" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "2", 
            "label": "Georgian Era: 1700 - 1879", "start": "1700", "end": "1879", "interval": "20" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "3", 
            "label": "Machine Age: 1880 - 1939", "start": "1880", "end": "1939", "interval": "10" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "4", 
            "label": "Atomic Age: 1940 - 1969", "start": "1940", "end": "1969", "interval": "5" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "5", 
            "label": "Information Age: 1970 - present", "start": "1970", "interval": "5" },
      ]

  });
