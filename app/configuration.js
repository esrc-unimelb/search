{
      "production":               "https://solr.esrc.unimelb.edu.au",
      "testing":                  "https://data.esrc.info/solr",
      "deployment":               "production",
      "site":                     "EOAS",
      "searchType":               "keyword",
      "keywordSearchOperator":    "AND",
      "datasetStart":             "1600-01-01T00:00:00Z",
      "datasetEnd":               "2014-12-31T23:59:59Z",

      "searchFields": {
          "0": { "fieldName": "name",           "displayName": "Entity Name",           "weight": "100" },
          "1": { "fieldName": "altname",        "displayName": "Entity Alternate Name", "weight": "50" },
          "2": { "fieldName": "locality",       "displayName": "Locality",              "weight": "30" },
          "3": { "fieldName": "text",           "displayName": "Entity Content",        "weight": "10" },
          "4": { "fieldName": "description",    "displayName": "Resource Content",      "weight": "1" }
      },

      "facetWidgets": [
          { "facetField": "type",       "label": "Entity Type",     "join": "OR"  },
          { "facetField": "function",   "label": "Entity Function", "join": "AND" }
      ],

      "dateFacetWidgets": {
      }

}
