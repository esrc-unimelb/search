NG_DOCS={
  "sections": {
    "api": "API Documentation"
  },
  "pages": [
    {
      "section": "api",
      "id": "Configuration",
      "shortName": "Configuration",
      "type": "service",
      "moduleName": "Configuration",
      "shortDescription": "Configuration object for the app.",
      "keywords": "api app configuration object service"
    },
    {
      "section": "api",
      "id": "facet-widget",
      "shortName": "facet-widget",
      "type": "directive",
      "moduleName": "facet-widget",
      "shortDescription": "A UI control for a SOLR facet. Displays the available content as a set",
      "keywords": "api checkboxes content control counts directive displays facet facet-widget facetfield field filters label query set solr ui widget"
    },
    {
      "section": "api",
      "id": "generic-result-display",
      "shortName": "generic-result-display",
      "type": "directive",
      "moduleName": "generic-result-display",
      "shortDescription": "A UI control for displaying a search result.",
      "keywords": "api control data directive displaying generic-result-display result search ui"
    },
    {
      "section": "api",
      "id": "LoggerService",
      "shortName": "LoggerService",
      "type": "service",
      "moduleName": "LoggerService",
      "shortDescription": "Logging service.",
      "keywords": "api loggerservice logging service"
    },
    {
      "section": "api",
      "id": "LoggerService.service:debug",
      "shortName": "debug",
      "type": "function",
      "moduleName": "LoggerService",
      "shortDescription": "Log a message at level DEBUG",
      "keywords": "api debug function level log loggerservice message msg service"
    },
    {
      "section": "api",
      "id": "LoggerService.service:error",
      "shortName": "error",
      "type": "function",
      "moduleName": "LoggerService",
      "keywords": "api function loggerservice service"
    },
    {
      "section": "api",
      "id": "LoggerService.service:info",
      "shortName": "info",
      "type": "function",
      "moduleName": "LoggerService",
      "keywords": "api function loggerservice service"
    },
    {
      "section": "api",
      "id": "LoggerService.service:init",
      "shortName": "init",
      "type": "function",
      "moduleName": "LoggerService",
      "shortDescription": "Initialise the level. Default is ERROR.",
      "keywords": "api default error function initialise level loggerservice service"
    },
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