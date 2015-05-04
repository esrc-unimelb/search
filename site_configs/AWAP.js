{
      "site":                     "AWAP",
      "deployment":               "production",
      "debug":                    false,
      "testing":                  "https://data.esrc.info/solr",
      "production":               "https://solr.esrc.unimelb.edu.au",
      "connex":                   "https://connex.esrc.unimelb.edu.au/#/entity",
      "connexBackend":            "https://cnex.esrc.unimelb.edu.au",
      "disableConnex":            true,
      "searchType":               "keyword",
      "searchTypeKeywordUnion":   "AND",
      "datasetStart":             "1700-01-01T00:00:00Z",
      "datasetEnd":               "2015-12-31T23:59:59Z",

      "searchFields": {
          "name":        { "fieldName": "name",           "displayName": "Entity Name",           "weight": "100" },
          "altname":     { "fieldName": "altname",        "displayName": "Entity Alternate Name", "weight": "50" },
          "text":        { "fieldName": "text",           "displayName": "Entity Content",        "weight": "10" },
          "description": { "fieldName": "description",    "displayName": "Resource Content",      "weight": "1" }
      },

      "facetWidgets": [
          { "facetField": "type",       "label": "Entity Type",     "join": "OR" },
          { "facetField": "function",   "label": "Descriptors",     "join": "AND" },
          { "facetField": "repository", "label": "Repository",      "join": "OR" }
      ],

      "dateFacetWidgets": [
          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "1", 
            "label": "1700 - 1800", "start": "1700", "end": "1800", "interval": "25" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "2", 
            "label": "1801 - 1900", "start": "1800", "end": "1900", "interval": "25" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "3", 
            "label": "1901 - present", "start": "1800", "interval": "10" }

      ]

}
