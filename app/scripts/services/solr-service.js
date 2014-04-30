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
    function search(what, start) {
        SolrService.term = what;
        if (what.split(' ').length > 1) {
            var q = 'name:"' + what + '"^10 OR text:"' + what + '"';
        } else {
            var q = 'name:' + what + '^10 OR text:' + what + '';
        }

        // do we have a phrase or a word?
        q = SolrService.solr + '?q=' + q + '&start=' + start + '&json.wrf=JSON_CALLBACK';
        log.debug(q);

        $http.jsonp(q).then(function(d) {
            saveData(d);
        });
    }

    function getResults() {
        return SolrService.results;
    }

    function saveData(d) {
        SolrService.results = {
            'term': SolrService.term,
            'total': d.data.response.numFound,
            'page_current': d.data.response.start,
            'page_total': parseInt(d.data.response.numFound / d.data.response.docs.length),
            'docs': d.data.response.docs,
            'mlt':  d.data.moreLikeThis,
        }
        $rootScope.$broadcast('search-results-updated');
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
        getResults: getResults,
        saveData: saveData,
        previousPage: previousPage,
        nextPage: nextPage,
        getCurrentPage: getCurrentPage,
        getLastPage: getLastPage
    }
    return SolrService;
  }]);
