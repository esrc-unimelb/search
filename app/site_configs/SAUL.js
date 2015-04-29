{
      "site":                     "SAUL",
      "deployment":               "production",
      "debug":                    false,
      "testing":                  "https://data.esrc.info/solr",
      "production":               "https://solr.esrc.unimelb.edu.au",
      "connex":                   "https://connex.esrc.unimelb.edu.au/#/entity",
      "connexBackend":            "https://cnex.esrc.unimelb.edu.au",
      "searchType":               "keyword",
      "disableConnex":            true,
      "searchTypeKeywordUnion":   "AND",
      "datasetStart":             "1900-01-01T00:00:00Z",
      "datasetEnd":               "2015-12-31T23:59:59Z",

      "searchFields": {
          "name":        { "fieldName": "name",           "displayName": "Entity Name",           "weight": "100" },
          "altname":     { "fieldName": "altname",        "displayName": "Entity Alternate Name", "weight": "50" },
          "text":        { "fieldName": "text",           "displayName": "Entity Content",        "weight": "10" },
          "description": { "fieldName": "description",    "displayName": "Resource Content",      "weight": "1" }
      },

      "facetWidgets": [
          { "facetField": "type",       "label": "Entity Type",     "join": "OR" },
          { "facetField": "function",   "label": "Poll Topic", "join": "AND" }
      ],

      "dateFacetWidgets": [
          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "1",
            "label": "1800 - 1899", "start": "1800", "end": "1899", "interval": "50" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "2",
            "label": "1900 - 1969", "start": "1900", "end": "1969", "interval": "10" },

          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "3",
            "label": "1970 - present day", "start": "1970", "interval": "5" }

      ]

}
