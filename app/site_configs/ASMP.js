{
      "site":                     "ASMP",
      "deployment":               "production",
      "debug":                    false,
      "testing":                  "https://data.esrc.info/solr",
      "production":               "https://solr.esrc.unimelb.edu.au",
      "connex":                   "https://connex.esrc.unimelb.edu.au/#/entity",
      "connexBackend":            "https://cnex.esrc.unimelb.edu.au",
      "disableConnex":            true,
      "searchType":               "keyword",
      "searchTypeKeywordUnion":   "AND",
      "datasetStart":             "1760-01-01T00:00:00Z",
      "datasetEnd":               "1890-12-31T23:59:59Z",

      "searchFields": {
          "name":        { "fieldName": "name",           "displayName": "Entity Name",           "weight": "100" },
          "altname":     { "fieldName": "altname",        "displayName": "Entity Alternate Name", "weight": "50" },
          "text":        { "fieldName": "text",           "displayName": "Entity Content",        "weight": "10" },
          "description": { "fieldName": "description",    "displayName": "Resource Content",      "weight": "1" }
      },

      "facetWidgets": [
          { "facetField": "type",       "label": "Entity Type",     "join": "OR" },
          { "facetField": "function",   "label": "Entity Function", "join": "AND" }
      ],

      "dateFacetWidgets": [
          { "facetField": "exist_from", "existenceFromField": "exist_from", "existenceToField": "exist_to", "id": "1", 
            "label": "1760 - 1890", "start": "1760", "end": "1890", "interval": "10" }

      ]

}
