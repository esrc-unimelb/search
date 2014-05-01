'use strict';

angular.module('searchApp')
  .factory('SolrService', [ '$rootScope', '$http', 'LoggerService', 
        function SolrService($rootScope, $http, log) {
    // AngularJS will instantiate a singleton by calling "new" on this function
   
    function init(deployment, site, loglevel) {
        log.init(loglevel);
        if (deployment !== undefined && site !== undefined) {
            SolrService.site = site;
            if (deployment === 'production') {
                SolrService.solr = 'http://data.esrc.unimelb.edu.au/solr/' + site + '/select';
            } else {
                SolrService.solr = 'http://data.esrc.info/solr/' + site + '/select';
            }
        }
    }

    /*
     * Method: search
     * Perform a simple phrase search on the name and text fields
     *  - doesn't do fuzzy matching or wildcard searching
     */
    function search(what, start, ditch_suggestion) {
        if (ditch_suggestion) {
            ditchSuggestion();

        }
        SolrService.term = what;
        
        // do we have a phrase or a word?
        if (what.split(' ').length > 1) {
            var q = 'name:"' + what + '"^10 OR text:"' + what + '"';
        } else {
            var q = 'name:' + what + '^10 OR text:' + what + '';
        }

        q = SolrService.solr + '?q=' + q + '&start=' + start + '&json.wrf=JSON_CALLBACK';
        log.debug(q);

        $http.jsonp(q).then(function(d) {
            if (d.data.response.numFound === 0) {
                // no matches - run a fuzzy search and present options
                suggest(SolrService.term);
                if (what.split(' ').length === 1) {
                    search(what + '~', 0, false);
                } else {
                    saveData(undefined);
                }
            } else {
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

        q = SolrService.solr + '?q=' + q + '&rows=0&mlt=off&json.wrf=JSON_CALLBACK';
        log.debug(q);

        $http.jsonp(q).then(function(d) {
            saveSuggestion(d);
        })

    }

    function saveData(d) {
        if ( d === undefined) {
            SolrService.results = {
                'term': SolrService.term,
                'total': 0,
            };
        } else {
            SolrService.results = {
                'term': SolrService.term,
                'total': d.data.response.numFound,
                'page_current': d.data.response.start,
                'page_total': parseInt(d.data.response.numFound / d.data.response.docs.length),
                'docs': d.data.response.docs,
                'mlt':  d.data.moreLikeThis,
            }
        }
        $rootScope.$broadcast('search-results-updated');
    }

    function saveSuggestion(d) {
        SolrService.suggestion =  d.data.spellcheck.suggestions[1]['suggestion'][0];
        $rootScope.$broadcast('search-suggestion-available');
    }
    function ditchSuggestion(d) {
        SolrService.suggestion =  undefined;
        $rootScope.$broadcast('search-suggestion-removed');
    }

    function previousPage() {
        var start = SolrService.results['page_current'] - 1;
        return search(SolrService.term, start);
    }
    function nextPage() {
        var start = SolrService.results['page_current'] + 1;
        return search(SolrService.term, start);
    }
    function getCurrentPage() {
        return parseInt(SolrService.results['page_current']);
    }
    function getLastPage() {
        return parseInt(SolrService.results['page_total']);
    }

    var SolrService = {
        log_level: 'ERROR',
        results: {},
        term: '',

        init: init,
        search: search,
        saveData: saveData,
        previousPage: previousPage,
        nextPage: nextPage,
        getCurrentPage: getCurrentPage,
        getLastPage: getLastPage
    }
    return SolrService;
  }]);
