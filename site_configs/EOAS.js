{
      "site":                     "EOAS",
      "deployment":               "production",
      "debug":                    false,
      "testing":                  "https://data.esrc.info/solr",
      "production":               "https://solr.esrc.unimelb.edu.au",
      "connex":                   "https://connex.esrc.unimelb.edu.au/#/entity",
      "connexBackend":            "https://cnex.esrc.unimelb.edu.au",
      "disableConnex":            "true",
      "searchType":               "keyword",
      "searchTypeKeywordUnion":   "AND",
      "datasetStart":             "1600-01-01T00:00:00Z",
      "datasetEnd":               "2014-12-31T23:59:59Z",

      "searchFields": {
          "name":        { "fieldName": "name",           "displayName": "Entity Name",           "weight": "100" },
          "altname":     { "fieldName": "altname",        "displayName": "Entity Alternate Name", "weight": "50" },
          "text":        { "fieldName": "text",           "displayName": "Entity Content",        "weight": "10" },
          "description": { "fieldName": "description",    "displayName": "Resource Content",      "weight": "1" }
      },

      "facetWidgets": [
          { "facetField": "type",       "label": "Entity Type",     "join": "OR" },
          { "facetField": "function",   "label": "Entity Function", "join": "AND" },
          { "facetField": "repository", "label": "Repository",      "join": "OR" }
      ],

      "dateFacetWidgets": [
          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "1", 
            "label": "1600 - 1699", "start": "1600", "end": "1699", "interval": "10" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "2", 
            "label": "1700 - 1800", "start": "1700", "end": "1799", "interval": "10" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "3", 
            "label": "1800 - 1900", "start": "1800", "end": "1899", "interval": "10" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "4", 
            "label": "1900 - 2000", "start": "1900", "end": "1999", "interval": "10" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "5", 
            "label": "2000 - present day", "start": "2000", "interval": "5" }

      ]

}
