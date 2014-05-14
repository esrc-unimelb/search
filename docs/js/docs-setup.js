NG_DOCS={
  "sections": {
    "api": "API Documentation"
  },
  "pages": [
    {
      "section": "api",
      "id": "SolrService",
      "shortName": "SolrService",
      "type": "service",
      "moduleName": "SolrService",
      "shortDescription": "Service to broker all communication between SOLR and the UI controls",
      "keywords": "$http $rootscope api broker communication configuration controls loggerservice service solr solrservice ui"
    },
    {
      "section": "api",
      "id": "SolrService.service:facet",
      "shortName": "facet",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "Add or remove a facet from the facet query object and trigger",
      "keywords": "add api facet facet_field field function object query remove search service solrservice trigger"
    },
    {
      "section": "api",
      "id": "SolrService.service:getFacet",
      "shortName": "getFacet",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "Trigger a facet search returning a promise for use by the caller.",
      "keywords": "api call caller data facet facetfield field function getfacet http promise returning search service solrservice trigger"
    },
    {
      "section": "api",
      "id": "SolrService.service:getFilterObject",
      "shortName": "getFilterObject",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "Return an array of filter queries",
      "keywords": "api array filter function queries return service solrservice"
    },
    {
      "section": "api",
      "id": "SolrService.service:init",
      "shortName": "init",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "Initialise the service. This MUST be called prior to the service being used. Probably",
      "keywords": "api app broken called core deployment disabled ensure facp false figure form function good_to_go init initialise loaded method prior production required scope search service site solr solrservice target testing time true"
    },
    {
      "section": "api",
      "id": "SolrService.service:nextPage",
      "shortName": "nextPage",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "Get the next set of results.",
      "keywords": "api function service set solrservice"
    },
    {
      "section": "api",
      "id": "SolrService.service:saveData",
      "shortName": "saveData",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "Pass it a SOLR response and it manages the data object used by the interface.",
      "keywords": "$rootscope api broadcast data function handle infinite interacts interface listen manages message method object pass ready response result scroll search-results-updated service solr solrservice widget"
    },
    {
      "section": "api",
      "id": "SolrService.service:search",
      "shortName": "search",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "The workhorse function.",
      "keywords": "api automatically check delete ditch_suggestion fields filters function fuzzy multiple perform phrase play re-run requested result search service simple single solrservice spell spelling start suggestion term text thing treated word workhorse"
    },
    {
      "section": "api",
      "id": "SolrService.service:suggest",
      "shortName": "suggest",
      "type": "function",
      "moduleName": "SolrService",
      "shortDescription": "Perform a spell check on the user request and return save a suggestion.",
      "keywords": "api check find function perform request return save search service solrservice spell spelling string suggestion user"
    }
  ],
  "apis": {
    "api": true
  },
  "html5Mode": true,
  "startPage": "/api",
  "scripts": [
    "angular.min.js"
  ]
};