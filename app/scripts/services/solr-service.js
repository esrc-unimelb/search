'use strict';

/**
 * @ngdoc service
 * @name SolrService
 * @description 
 *  Service to broker all communication between SOLR and the UI controls
 *
 * @requires $rootScope
 * @requires $http
 * @requires Configuration
 *
 */
angular.module('searchApp')
  .factory('SolrService', [ '$rootScope', '$http', '$routeParams', '$route', '$location', '$timeout', '$window', '$log', 'Configuration',
        function SolrService($rootScope, $http, $routeParams, $route, $location, $timeout, $window, $log, conf) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // when the route changes, if we're not already initting
    //  wipe any saved state and kick off an init
    $rootScope.$on('$locationChangeStart', function(e, n, o) {
        if (SolrService.appInit || n.match('#view')) {
            // if application initialising or we're loading a view
            // --> do nothing
            // and remove the initialisation flag if set
            SolrService.appInit = false;
        } else if (!n.match('#view') && o.match('#view')) {
            // if we're unloading a view and going back
            // --> also do nothing
            // and remove the initialisation flag if set
            SolrService.appInit = false;
        } else {
            // otherwise initialise the app
            SolrService.init();
        }
    });

    /** 
    * @ngdoc function 
    * @name SolrService.service:init
    * @description
    *   Initialise the service. This MUST be called prior to the service being used. Probably
    *   from an init method when a search form is loaded (this is likely the first time the 
    *   service will be required).
    * @param {string} deployment - The SOLR deployment to target: testing || production
    * @param {string} site - The SOLR core to target; e.g. FACP
    * @returns {boolean} true or false to tell you all is well or not. Use this to figure out
    *   if the app should be disabled.
    * @example
    *   // initialise the service and ensure we stop if it's broken<br/>
    *   scope.good_to_go = SolrService.init(scope.deployment, scope.site);
    *
    */
    function init() {
        // do we need to load an external config or use the app in built configuration?
        var params = $location.search();
        if (params.config) {
            // if a config file is referenced in the url; load it
            var curl = 'site_configs/' + params.config + '.js';
            $http.get(curl).then(function(resp) {
                // got it - save it and use it
                $log.info('Loading external configuration.');
                return go(resp.data);
            },
            function(resp) {
                // Could't load external config - assuming the URL exists it's most likely
                //  invalid JSON.
                $log.error('Unable to load external configuration.');
                $log.error('Check that the URL is valid and the content is valid JSON.');
                $log.error(resp);
            })
        } else {
            // no external config referenced; carry on with internal configuration
            $log.info('No external configuration referenced. Using internal configuration.');
            return go();
        }
    }

    function go(configuration) {
        $log.info('#########');
        $log.info('######### APPLICATION INITIALISED');
        $log.info('#########');


        var site;
        if (configuration != undefined) {
            // use external configuration
            // when loading an external configuration, ignore site if in route params
            site = configuration.site;

        } else {
            // use application internal configuration
            configuration = conf;

            // if site is defined in the route params, use it in preference
            //  to the site defined in the internal configuration
            site = configuration.site;
            if ($routeParams.site !== undefined && $routeParams.site !== 'embed') site = $routeParams.site;
        }

        // location.search is not empty and provided there is more than config defined
        var search = angular.copy($location.search());
        if (_.has(search, 'config')) delete search.config;
        if (!_.isEmpty(search)) { 
            sessionStorage.removeItem('cq');
        }

        // url search parameters override saved queries
        //  although: if the search param is config - try to load saved data first
        if (_.isEmpty($location.search()) || _.has($location.search(), 'config')) {
            var q = SolrService.loadData();
            if (q) { 
                var savedData = initAppFromSavedData();
                if (savedData.configuration.site === site) {
                    SolrService.query = savedData.query;
                    SolrService.configuration = savedData.configuration;
                    SolrService.site = savedData.configuration.site;
                } else {
                    $log.info("Site stored in saved data doesn't match incoming config.")
                    sessionStorage.removeItem('cq');
                    initCurrentInstance(configuration, site);
                }

            } else {
                $log.info("Unable to initialise from saved data.")
                initCurrentInstance(configuration, site);
            }
        } else {
            // initialise the application
            initCurrentInstance(configuration, site);
        } 

        $log.debug('Searching: ' + SolrService.query.site);
        $log.debug('Query object at initialisation', SolrService.query);
        $log.debug('Configuration object at initialisation', SolrService.configuration);

        // get the sites in connex
        getConnexSites();

        // Broadcast ready to go
        $timeout(function() {
            $log.info('Application bootstrapped');
            $rootScope.$broadcast('app-ready');
        }, 500);
       
        return true;
    }

    function initialiseQueryObject(configuration, site) {
        if (configuration) SolrService.configuration = angular.copy(configuration);
        if (site) SolrService.configuration.site = site;

        SolrService.query = {};
        SolrService.query.site = SolrService.configuration.site;
        SolrService.query.solr = SolrService.configuration[conf.deployment] + '/' + SolrService.configuration.site + '/select';
        SolrService.query.searchFields = SolrService.configuration.searchFields;
        SolrService.query.searchWhat = _.keys(SolrService.query.searchFields);
        SolrService.query.searchType = SolrService.configuration.searchType;
        SolrService.query.searchTypeKeywordUnion = SolrService.configuration.searchTypeKeywordUnion;
        SolrService.query.term = '*';
        SolrService.query.filters = {};
        SolrService.query.dateFilters = {};
        SolrService.query.filterUnion = {};
        SolrService.query.facets = {};
        SolrService.query.dateFacets = {};
    }

    /*
     * @ngdoc function
     * @name loadData
     */
    function loadData() {
        var d = sessionStorage.getItem('cq');
        return angular.fromJson($rootScope.$eval(d));
    }

    /**
     * @ngdoc function
     * @name initAppFromSavedData
     */
    function initAppFromSavedData() {
        $log.info('Initialising app from saved data');
        return SolrService.loadData();
    }

    /**
     * @ngdoc function
     * @name initCurrentInstance
     */
    function initCurrentInstance(configuration, site) {
        $log.info('Bootstrapping app');

        // now actually initialise this instance
        initialiseQueryObject(configuration, site);

        // set a flag to say we're currently initting
        SolrService.appInit = true;

        var params = angular.copy($location.search());

        // if there's a term in the URL - set it
        SolrService.query.term = params.q !== undefined ? params.q : '*';

        // strip terms and config if set in the url
        if (params.q) delete params.q;
        if (params.config) {
            var config = params.config;
            delete params.config;
        }

        // set the various facets defined in the URI
        angular.forEach(params, function(v,k) {
            if (typeof(v) === 'object') {
                for (var i=0; i < v.length ; i++) {
                    SolrService.filterQuery(k, v[i], true);
                }
            } else {
                SolrService.filterQuery(k, v, true);
            }
        });

        // wipe the location params
        if (config) {
            $location.search({'config': config}).replace();
        } else {
            $location.search({}).replace();
        }
    }

    /**
     * @ngdoc function
     * @name getQuery
     * @description
     *  Construct the actual query object - the workhorse
     */
    function getQuery(start, nofilters) {
        var searchFields = [];
        angular.forEach(SolrService.query.searchFields, function(v,k) {
            if (_.contains(SolrService.query.searchWhat, v.fieldName)) 
                searchFields.push({ 'name': SolrService.query.searchFields[k].fieldName, 'weight': SolrService.query.searchFields[k].weight });
        });

        // term can never, ever, be empty...
        if (_.isEmpty(SolrService.query.term)) SolrService.query.term = '*';
        var what = SolrService.query.term, 
            q    = [];
        // are we doing a wildcard search? or a single term search fuzzy search?
        if ( what === '*' || what.substr(-1,1) === '~') {
           angular.forEach(searchFields, function(v, k) {
               q.push(v.name + ':(' + what + ')^' + v.weight);
           })
        } else {
           if (SolrService.query.searchType === 'keyword') {
              what = what.replace(/ /gi, ' ' + SolrService.query.searchTypeKeywordUnion + ' ');
              angular.forEach(searchFields, function(v, k) {
                  q.push(v.name + ':(' + what + ')^' + v.weight);
              })

            } else {
                angular.forEach(searchFields, function(v, k) {
                    q.push(v.name + ':"' + what + '"^' + v.weight);
                })
             }
         }
        q = q.join(' OR ');

        // when compiling the data facets for the date widget,
        //  we don't want the saved filters applied so that we get
        //  all of the date facets
        if (!nofilters) {
            // add in the facet query filters - if any...
            var fq = getFilterObject().join(' AND ');
            if (_.isEmpty(fq)) fq = '';
        }

        // set the sort order: wildcard sort ascending, everything else: by score
        if (_.isEmpty(SolrService.query.sort)) {
            if (what === '*') {
                SolrService.query.sort = 'name_sort asc';
            } else {
                SolrService.query.sort = 'score desc';
            }
        }

        var query = {
            'url': SolrService.query.solr,
            'params': {
                'q': q,
                'start': start,
                'rows': SolrService.rows,
                'wt': 'json',
                'json.wrf': 'JSON_CALLBACK',
                'fq': fq,
                'sort': SolrService.query.sort
            },
        };
        return query;
    }

    /**
     * @ngdoc function
     * @name saveCurrentSearch
     * @description
     *  Save the current search to the browser's session storage
     */
    function saveCurrentSearch() {
        // store the current query object in the url for later use
        var currentQuery = {
            'date': Date.now(),
            'query': SolrService.query,
            'configuration': SolrService.configuration
        }
        $log.debug('Storing the current query: ' + currentQuery.date);
        $log.debug(currentQuery);
        sessionStorage.setItem('cq', angular.toJson(currentQuery));
    }

    /**
     * @ngdoc function
     * @name saveCurrentSearch
     * @description
     *  Save the current search to the browser's session storage
     */
    function saveCurrentSearch() {
        // store the current query object in the url for later use
        var currentQuery = {
            'date': Date.now(),
            'term': SolrService.term,
            'q': getQuery(0),
            'filters': SolrService.filters,
            'dateFilters': SolrService.dateFilters,
            'searchType': SolrService.searchType,
            'sort': SolrService.sort,
            'site': SolrService.site,
            'nResults': SolrService.results.docs.length
        }
        $log.debug('Storing the current query: ' + currentQuery.date);
        sessionStorage.setItem('cq', angular.toJson(currentQuery));
    }

    /**
     * @ngdoc function
     * @name SolrService.service:search
     * @description
     *  The workhorse function.
     *
     *  Perform a simple phrase search on the name and text fields. If no results are found,
     *  there are no filters in play and the term is a single word, the search is automatically re-run as 
     *  a fuzzy search and a spell check is requested as well.
     *
     * @param {string} what - The thing to search for. Multiple words get treated
     *  as a phrase.
     * @param {string} start - The result to start at. 
     * @param {boolean} ditchuggestion - Whether to delete the spelling 
     *  suggestion.
     */
    function search(start, ditchSuggestion, saveSearch) {
        // should we remove the suggestion
        //   the only time this should be true is when the method is called
        //   from basic-search. Pretty much all other times it will be false
        //   ie. suggestion will be shown
        if (ditchSuggestion) {
            SolrService.suggestion =  undefined;
            $rootScope.$broadcast('search-suggestion-removed');
        }

        if (start === undefined) { start = 0; }

        // get the query object
        var q = getQuery(start);
        $log.debug(q);
        
        $http.jsonp(SolrService.query.solr, q).then(function(d) {
            // if we don't get a hit and there aren't any filters in play, try suggest and fuzzy seearch
            // 
            // Note: when filters are in play we can't re-run search as the set might return no
            //  result and we'll end up in an infinite search loop

            if (d.data.response.numFound === 0 && _.isEmpty(SolrService.query.filters) && _.isEmpty(SolrService.query.dateFilters)) {
                // no matches - do a spell check and run a fuzzy search 
                //  ONLY_IF it's a single word search term
                if (SolrService.query.term.split(' ').length === 1) {
                    suggest(SolrService.query.term);
                    if (SolrService.query.term !== '*') {
                        if (SolrService.query.term.substr(-1,1) !== '~') {
                            SolrService.query.term = SolrService.query.term + '~';
                            search(0, false);
                        }
                    }
                } else {

                    // a phrase; wipe the results - can't do anything sensible
                    saveData(undefined);

                }
            } else {
                // all good - results found
                saveData(d);
            }
        });
    }

    /**
     * @ngdoc function
     * @name SolrService.service:suggest
     * @description
     *  Perform a spell check on the user request and return save a suggestion.
     *
     * @param {string} what - The user search string for which to find a spelling
     *  suggestion.
     *  
     */
    function suggest(what) {
        var q;
        q = {
            'url': SolrService.query.solr,
            'params': {
                'q': 'name:' + what,
                'rows': 0,
                'wt': 'json',
                'json.wrf': 'JSON_CALLBACK'
            }
        };

        //$log.debug('Suggest: ');
        //$log.debug(q);

        $http.jsonp(SolrService.query.solr, q).then(function(d) {
            SolrService.suggestion =  d.data.spellcheck.suggestions[1].suggestion[0];
            $rootScope.$broadcast('search-suggestion-available');
        });
    }

    /**
     * @ngdoc function
     * @name SolrService.service:saveData
     * @description
     *  Pass it a SOLR response and it manages the data object used by the interface.
     *  
     *  This method knows how to handle no result found as well as new data via infinite scroll.
     *  
     *  The message 'search-results-updated' is broadcast via $rootScope when the data is ready
     *   to go. Any widget that interacts with the data should listen for this message.
     * @param {object} d - The SOLR response
     */
    function saveData(d) {
        if (d === undefined) {
            SolrService.results = {
                'term': SolrService.query.term,
                'total': 0,
                'docs': []
            };
        } else {
            var docs = [], start;
            start = parseInt(d.data.responseHeader.params.start);
            docs = _.map(d.data.response.docs, function(d, i) { d.sequenceNo = i + start; return d; });
            SolrService.results = {
                'dateStamp': ( new Date() ).getTime(),
                'term': SolrService.query.term,
                'total': d.data.response.numFound,
                'start': start,
                'docs': docs
            };
        }
        
        // update all facet counts
        $rootScope.$broadcast('update-all-facets');
        saveCurrentSearch();

        // notify the result widget that it's time to update
        $rootScope.$broadcast('search-results-updated');
    }

    /**
     * @ngdoc function
     * @name SolrService.service:previousPage
     * @description
     *  Get the next set of results.
     */
    function previousPage() {
        var start = SolrService.results.start - SolrService.rows;
        SolrService.query.start = start;
        if (start < 0 || SolrService.query.start < 0) {
            SolrService.query.start = 0;
            start = 0;
        }
        search(start);
    }

    /**
     * @ngdoc function
     * @name SolrService.service:nextPage
     * @description
     *  Get the next set of results.
     */
    function nextPage() {
        var start = SolrService.results.start + SolrService.rows;
        SolrService.query.start = start;
        search(start);
    }

    /**
     * @ngdoc function
     * @name SolrService.service:updateFacetCount
     * @description
     *  Trigger a facet search returning a promise for use by the caller.
     * @param {string} facet - The field to facet on
     */
    function updateFacetCount(facet, offset, limit, sortBy) {
        if (offset === undefined) {
            offset = 0;
        }
        if (limit === undefined) {
            limit = -1;
        }
        if (sortBy === undefined) {
            sortBy = 'count';
        }

        var q = getQuery(0);
        q.params.facet = true;
        q.params['facet.field'] = facet;
        q.params['facet.limit'] = SolrService.facetLimit;
        q.params.rows = 0;
        //$log.debug(q);
        $http.jsonp(SolrService.query.solr, q).then(function(d) {
            var f = [];
            _.each(d.data.facet_counts.facet_fields, function(v, k) {
                for (var i = 0; i < v.length; i += 2) {
                    f.push({
                        'name': v[i],
                        'count': v[i+1]
                    })
                }
            });
            SolrService.query.facets[facet] = f;
            $rootScope.$broadcast(facet+'-facets-updated');
        });
    }

    /*
     * @ngdoc function
     * @name SolrService.service:updateAllFacetCounts
     * @description
     *  Iterate over the facets and update them all relative to the 
     *  current context.
     */
    function updateAllFacetCounts() {
        // now trigger an update of all facet counts
        //angular.forEach(SolrService.facets, function(v, k) {
        //    SolrService.updateFacetCount(k);
        //});
        $rootScope.$broadcast('update-all-facets');
        //$rootScope.$broadcast('update-date-facets');
    }

    /**
     * @ngdoc function
     * @name SolrService.service:filterQuery
     * @description
     *  Add or remove a facet from the filter query object and trigger
     *  a search.
     * @param {string} facetField - The facet's field name
     * @param {string} facet - the value
     * @param {string} dontSearch - optional value to disable the search part
     */
    function filterQuery(facetField, facet, dontSearch) {
        // iterate over the facets and 
        //  - add it if it's not there 
        //  - remove it if it is

        // ensure there's a key for this facetField in the filters object
        if (! _.has(SolrService.query.filters, facetField)) SolrService.query.filters[facetField] = [];

        // now determine whether the actual facet needs to be pushed in or spliced out
        if (_.contains(SolrService.query.filters[facetField], facet)) {
            SolrService.query.filters[facetField] = _.without(SolrService.query.filters[facetField], facet);
        } else {
            SolrService.query.filters[facetField].push(facet);
        }
        //$log.debug('S:solr-service, filterQuery, filters', SolrService.query.filters);

        // update the search
        search();
    }

    /**
     * @ngdoc function
     * @name SolrService.service:filterDateQuery
     * @description
     *  Add or remove a date facet from the filter query object and trigger
     *  a search.
     * @param {string} facet
     */
    function filterDateQuery(facetField, existenceFromField, existenceToField, facetLabel, dontSearch) {
        var facetLowerBound, facetUpperBound, df, marker;
        facetLowerBound = facetLabel.split(' - ')[0];
        facetUpperBound = facetLabel.split(' - ')[1];
        if (existenceFromField !== undefined && existenceToField !== undefined) {
            marker = existenceFromField + '-' + existenceToField + '-' + facetLabel.replace(' - ', '_');
        } else {
            marker = facetField + '-' + facetLabel.replace(' - ', '_');
        }

        if (_.has(SolrService.query.dateFilters, marker)) {
            delete SolrService.query.dateFilters[marker];
        } else {
            df = {
                'from': facetLowerBound + '-01-01T00:00:00Z',
                'to': facetUpperBound + '-12-31T23:59:59Z',
                'facetField': facetField,
                'label': facetLabel,
                'existenceFromField': existenceFromField,
                'existenceToField': existenceToField,
            };
            SolrService.query.dateFilters[marker] = df;
        }
        //$log.debug('S:solr-service, filterDateQuery, dateFilters', SolrService.query.dateFilters);

        // update the search
        if (!dontSearch) search();
    }

    /**
     * @ngdoc function
     * @name SolrService.service:getFilterObject
     * @description
     *  Return an array of filter queries
     * @returns {array} An array of filter queries
     */
    function getFilterObject() {
        var fq = [];
        var f;
        
        // add in the named filters
        for (f in SolrService.query.filters) {
            var j = SolrService.query.filterUnion[f];
            if (!_.isEmpty(SolrService.query.filters[f])) fq.push(f + ':("' + SolrService.query.filters[f].join('" ' + j + ' "') + '")');
        }

        // add in the date range filters
        var dfq = [];
        for (f in SolrService.query.dateFilters) {
            var v = SolrService.query.dateFilters[f];
            if (! _.isEmpty(v)) {
                if (v.existenceFromField !== undefined && v.existenceToField !== undefined) {
                    var query;
                    var query = '(exist_from:[' + conf.datasetStart + ' TO ' + v.to + ']';
                    query += ' AND ';
                    query += 'exist_to:[' + v.from + ' TO ' + conf.datasetEnd + '])';
                    dfq.push(query);
                } else {
                    var query = v.facetField + ':[' + v.from + ' TO ' + v.to + ']';
                    dfq.push(query);
                }
            }

        }

        if (fq.length > 0 && dfq.length > 0) {
            fq = fq.concat([ '(' + dfq.join(' OR ') + ')' ]);
        } else if (dfq.length > 0) {
            fq = [ '(' + dfq.join(' OR ') + ')' ];
        }
        return fq;
    }

    /**
     * @ngdoc function
     * @name SolrService.service:reset
     * @description
     *   Removes all filters
     */
    function reset() {
        // ditch any saved configuration
        sessionStorage.removeItem('cq');

        // reinitialise the query object
        initialiseQueryObject();

        // kick off a search
        search();

        // tell all the filters to reset
        $rootScope.$broadcast('reset-all-filters');
    }

    /*
     * @ngdoc function
     * @name SolrService.service:clearFilter
     */
    function clearFilter(facet) {
        delete SolrService.filters[facet];
        
        // update the search
        search(SolrService.term, 0, true);
    }

    /**
     * @ngdoc function
     * @name SolrService.service:reSort
     * @description
     *  Re-sort the result set - this triggers a re-search with
     *  the updated sort order.
     */
    function reSort(by) {
        SolrService.query.sort = by;
        search();
    }

    /**
     * @ngdoc function
     * @name SolrService.service:compileDateFacets
     * @description
     *  Will determine the outer date bounds of the current context
     *   and store them within the object
     */
    function compileDateFacets(facetField, id, start, end, interval) {
        $rootScope.$broadcast('reset-date-facets');

        var a, b;
        a = getQuery(0, true);
        a.params.rows = 0;
        a.params.facet = true;
        a.params['facet.range'] = facetField;
        a.params['facet.range.start'] = start + '-01-01T00:00:00Z';
        a.params['facet.range.end'] = end + '-12-31T23:59:59Z';
        a.params['facet.range.gap'] = '+' + interval + 'YEARS';

        $http.jsonp(SolrService.query.solr, a).then(function(d) {
            var counts = d.data.facet_counts.facet_ranges[facetField].counts;
            var i, df;
            df = [];
            var thisYear = new Date().getFullYear();
            for (i=0; i < counts.length; i+=2) {
                var rangeEnd = parseInt(counts[i].split('-')[0]) + parseInt(interval) - 1;
                if (rangeEnd > end) {
                    rangeEnd = end;
                }
                if (rangeEnd > thisYear) {
                    rangeEnd = thisYear;
                }
                df.push({
                    'rangeStart': parseInt(counts[i].split('-')[0]), 
                    'rangeEnd': rangeEnd,
                    'count': counts[i+1]
                });
            }
            var marker = facetField + '_' + id;
            SolrService.query.dateFacets[marker] = df; 
            $rootScope.$broadcast(marker + '-facet-data-ready');
        });

    }

    /**
     * @ngdoc function
     * @name SolrService.service:getConnexSites
     * @description
     *    Get the list of site enabled in connex.
     *
    */
    function getConnexSites() {
        $http.get(SolrService.configuration.connexBackend).then(function(resp) {
            SolrService.configuration.connexSites = resp.data.sites;
        },
        function() {
            SolrService.configuration.connexSites = [];
        });
    }

    var SolrService = {
        // the query object - all bits of the query are stored here
        query: {},

        results: {},

        // suitable defaults
        rows: 12,
        facetLimit: 45,
        sort: undefined,
        hideDetails: false,

        init: init,
        loadData: loadData,
        search: search,
        saveData: saveData,
        previousPage: previousPage,
        nextPage: nextPage,
        updateFacetCount: updateFacetCount,
        filterQuery: filterQuery,
        getFilterObject: getFilterObject,
        filterDateQuery: filterDateQuery,
        reset: reset,
        reSort: reSort,
        compileDateFacets: compileDateFacets,
    };
    return SolrService;
  }])
