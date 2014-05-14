'use strict';

angular.module('searchApp')
  .factory('SolrService', [ '$rootScope', '$http', 'LoggerService', 'Configuration',
        function SolrService($rootScope, $http, log, conf) {
    // AngularJS will instantiate a singleton by calling "new" on this function
   

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

    /*
     * Method: search
     * Perform a simple phrase search on the name and text fields
     *  - doesn't do fuzzy matching or wildcard searching
     */
    function search(what, start, ditch_suggestion) {
        // should we remove the suggestion
        //   the only time this should be true is when the method is called
        //   from basic-search. Pretty much all other times it will be false
        //   ie. suggestion will be shown
        if (ditch_suggestion) {
            ditchSuggestion();
        }

        // if what has changed - reset the data object
        if (what !== SolrService.term || start === 0) {
            SolrService.results['docs'] = [];
            SolrService.results['start'] = 0;
        }
        // store the term for use in other places
        SolrService.term = what;
        
        // do we have a phrase or a word?
        if (what.split(' ').length > 1) {
            var q = 'name:("' + what + '"^10 OR text:"' + what + '")';
        } else {
            var q = 'name:(' + what + '^10 OR text:' + what + ')';
        }

        q = SolrService.solr + '?q=' + q + getFilters() + '&start=' + start + '&rows=' + SolrService.rows + '&wt=json&json.wrf=JSON_CALLBACK';
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
                    if (what.substr(-1,1) !== "~") {
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

    function suggest(what) {
        if (what.split(' ').length > 1) {
            var q = 'name:"' + what + '"';
        } else {
            var q = 'name:' + what + '';
        }

        q = SolrService.solr + '?q=' + q + '&rows=0&mlt=off&wt=json&json.wrf=JSON_CALLBACK';
        log.debug(q);

        $http.jsonp(q).then(function(d) {
            saveSuggestion(d);
        })
    }

    function saveData(d) {
        if (d === undefined) {
            SolrService.results = {
                'term': SolrService.term,
                'total': 0,
                'docs': []
            };
        } else {
            var docs;
            if (SolrService.results['docs'] === undefined) {
                docs = d.data.response.docs;
            } else {
                docs = SolrService.results['docs'];
                for (var i=0; i < d.data.response.docs.length; i++) {
                    docs.push(d.data.response.docs[i]);
                }
            }
            for (var i=0; i < docs.length; i++) {
                docs[i]['sequence_no'] = i;
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

    function saveSuggestion(d) {
        try {
            SolrService.suggestion =  d.data.spellcheck.suggestions[1]['suggestion'][0];
            $rootScope.$broadcast('search-suggestion-available');
        } catch(e) {
        }
    }
    function ditchSuggestion(d) {
        SolrService.suggestion =  undefined;
        $rootScope.$broadcast('search-suggestion-removed');
    }

    function nextPage() {
        var start = SolrService.results['start'] + SolrService.rows;
        return search(SolrService.term, start);
    }
    function getFacet(facet) {
        var q = SolrService.solr + '?q=*:*&rows=0&facet=true&facet.field=' + facet + '&wt=json&json.wrf=JSON_CALLBACK';
        //log.debug(q);
        return $http.jsonp(q);
    }

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

    function getFilterObject() {
        var fq = [];
        for (var f in SolrService.facets) {
            fq.push(f + ':("' + SolrService.facets[f].join('" OR "') + '")');
        }
        return fq;
    }
    function getFilters() {
        // add in the ANDed filters - if any...
        var fq = getFilterObject().join('&fq=');
        if (fq !== '') {
            fq = '&fq=' + fq;
        }
        return fq;
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
        getFilterObject: getFilterObject
    }
    return SolrService;
  }]);
