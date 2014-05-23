'use strict';

/** 
 * @ngdoc service
 * @name SolrService
 * @description 
 *  Service to broker all communication between SOLR and the UI controls
 *
 * @requires $rootScope
 * @requires $http
 * @requires LoggerService
 * @requires Configuration
 *
 */
angular.module('searchApp')
  .factory('SolrService', [ '$rootScope', '$http', 'LoggerService', 'Configuration',
        function SolrService($rootScope, $http, log, conf) {
    // AngularJS will instantiate a singleton by calling "new" on this function
   

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
    function init(deployment, site) {
        log.init(conf.loglevel);
        SolrService.site = site;

        if (deployment === undefined && deployment !== ('production' || 'testing')) {
           deployment = 'production';
        }
        if (site === undefined) {
            log.error("Can't run! No solr_core defined!");
            return false;
        } else {
            SolrService.solr = conf[deployment] + '/' + site + '/select';
        }
        log.debug('Solr Service: ' + SolrService.solr);
        log.debug('Site: ' + SolrService.site);

        return true;
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
     * @param {boolean} ditch_suggestion - Whether to delete the spelling 
     *  suggestion.
     */
    function search(what, start, ditch_suggestion) {
        // should we remove the suggestion
        //   the only time this should be true is when the method is called
        //   from basic-search. Pretty much all other times it will be false
        //   ie. suggestion will be shown
        if (ditch_suggestion) {
            SolrService.suggestion =  undefined;
            $rootScope.$broadcast('search-suggestion-removed');
        }

        // if what has changed - reset the data object
        if (what !== SolrService.term || start === 0) {
            SolrService.results.docs = [];
            SolrService.results.start = 0;
        }
        // store the term for use in other places
        SolrService.term = what;
        
        var q;
        // do we have a phrase or a word?
        if (what.split(' ').length > 1) {
            q = 'name:("' + what + '"^20 OR altname:"' + what + '"^10 OR locality:"' + what + '"^10 OR text:"' + what + '")';
        } else {
            q = 'name:(' + what + '^20 OR altname:' + what + '^10 OR locality:' + what + '^10 OR text:' + what + ')';
        }

        // add in the facet query filters - if any...
        var fq = getFilterObject().join('&fq=');
        if (fq !== '') {
            fq = '&fq=' + fq;
        }

        // construct the URL
        q = SolrService.solr + '?q=' + q + fq + '&start=' + start + '&rows=' + SolrService.rows + '&wt=json&json.wrf=JSON_CALLBACK';
        log.debug(q);

        $http.jsonp(q).then(function(d) {
            // if we don't get a hit and there aren't any filters in play, try suggest and fuzzy seearch
            // 
            // Note: when filters are in play we can't re-run search as the set might return no
            //  result and we'll end up in an infinite search loop
            if (d.data.response.numFound === 0 && Object.keys(SolrService.facets).length === 0) {
                // no matches - run a fuzzy search and present the spellcheck options
                suggest(SolrService.term);
                if (what.split(' ').length === 1 && what !== '*') {
                    if (what.substr(-1,1) !== '~') {
                        search(what + '~', 0, false);
                    } else {
                        search (what, 0, false);
                    }
                } else {
                    // not a term but a phrase; wipe the results; just leave the suggestion
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
        if (what.split(' ').length > 1) {
            q = 'name:"' + what + '"';
        } else {
            q = 'name:' + what + '';
        }

        q = SolrService.solr + '?q=' + q + '&rows=0&mlt=off&wt=json&json.wrf=JSON_CALLBACK';
        log.debug(q);

        $http.jsonp(q).then(function(d) {
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
                'term': SolrService.term,
                'total': 0,
                'docs': []
            };
        } else {
            var docs, i;
            if (SolrService.results.docs === undefined) {
                docs = d.data.response.docs;
            } else {
                docs = SolrService.results.docs;
                for (i=0; i < d.data.response.docs.length; i++) {
                    docs.push(d.data.response.docs[i]);
                }
            }
            for (i=0; i < docs.length; i++) {
                docs[i].sequence_no = i;
            }
            SolrService.results = {
                'term': SolrService.term,
                'total': d.data.response.numFound,
                'start': parseInt(d.data.responseHeader.params.start),
                'docs': docs, 
                //'mlt':  d.data.moreLikeThis,
            }
        }
        $rootScope.$broadcast('search-results-updated');
    }

    /**
     * @ngdoc function
     * @name SolrService.service:nextPage
     * @description
     *  Get the next set of results.
     */
    function nextPage() {
        var start = SolrService.results['start'] + SolrService.rows;
        search(SolrService.term, start);
    }

    /**
     * @ngdoc function
     * @name SolrService.service:getFacet
     * @description
     *  Trigger a facet search returning a promise for use by the caller.
     * @param {string} facet - The field to facet on
     * @returns {promise} The promise from the http call
     * @example
     *  SolrService.getFacet(scope.facetField).then(function(d) {
     *   //do something with the data
     *  }
     */
    function getFacet(facet) {
        var q = SolrService.solr + '?q=*:*&rows=0&facet=true&facet.field=' + facet + '&wt=json&json.wrf=JSON_CALLBACK';
        //log.debug(q);
        return $http.jsonp(q);
    }

    /**
     * @ngdoc function
     * @name SolrService.service:facet
     * @description
     *  Add or remove a facet from the facet query object and trigger
     *  a search.
     * @param {string} facet_field - The facet's field name
     * @param {string} facet - the value
     */
    function facet(facet_field, facet) {
        // iterate over the facets and 
        //  - add it if it's not there 
        //  - remove it if it is
        if (SolrService.facets[facet_field] === undefined) {
            SolrService.facets[facet_field] = [ facet ];
        } else {
            if (SolrService.facets[facet_field].indexOf(facet) === -1) {
                SolrService.facets[facet_field].push(facet);
            } else {
                var idxof = SolrService.facets[facet_field].indexOf(facet);
                SolrService.facets[facet_field].splice(idxof, 1);
                if (SolrService.facets[facet_field].length === 0) {
                    delete SolrService.facets[facet_field];
                }
            }
        }

        SolrService.results['docs'] = [];
        SolrService.results['start'] = 0;
        search(SolrService.term, 0, true);
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
        for (var f in SolrService.facets) {
            fq.push(f + ':("' + SolrService.facets[f].join('" OR "') + '")');
        }
        return fq;
    }

    /**
     * @ngdoc function
     * @name SolrServic.service:clearAllFilters
     * @description
     *   Removes all filters
     */
    function clearAllFilters() {
        SolrService.facets = [];
        search(SolrService.term, 0, true);
    }

    var SolrService = {
        results: {},
        facets: {},
        term: '*',
        rows: 10,

        init: init,
        search: search,
        saveData: saveData,
        nextPage: nextPage,
        getFacet: getFacet,
        facet: facet,
        getFilterObject: getFilterObject,
        clearAllFilters: clearAllFilters
    }
    return SolrService;
  }]);
