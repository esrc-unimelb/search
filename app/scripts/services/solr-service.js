'use strict';

angular.module('searchApp')
  .service('SolrService', [ '$rootScope', '$http', 'LoggerService', 
        function SolrService($rootScope, $http, log) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
        self: this,
        log_level: 'ERROR',
        results: {},
        term: '',

        init: function(deployment, site, loglevel) {
            log.init(loglevel);
            if (deployment !== undefined && site !== undefined) {
                this.site = site;
                if (deployment === 'production') {
                    this.solr = 'http://data.esrc.unimelb.edu.au/solr/' + site + '/select';
                } else {
                    this.solr = 'http://data.esrc.info/solr/' + site + '/select';
                }
            }

        },

        /*
         * Method: search
         * Perform a simple phrase search on the name and text fields
         *  - doesn't do fuzzy matching or wildcard searching
         */
        search: function(what, start) {
            this.term = what;
            if (what.split(' ').length > 1) {
                var q = 'name:"' + what + '"^10 OR text:"' + what + '"';
            } else {
                var q = 'name:' + what + '^10 OR text:' + what + '';
            }

            // do we have a phrase or a word?
            q = this.solr + '?q=' + q + '&start=' + start + '&json.wrf=JSON_CALLBACK';
            log.debug(q);

            return $http.jsonp(q);
        },

        getResults: function() {
            return this.results;
        },

        saveData: function(d) {
            this.results = {
                'term': this.term,
                'total': d.data.response.numFound,
                'page_current': d.data.response.start+1,
                'page_total': parseInt(d.data.response.numFound / d.data.response.docs.length),
                'docs': d.data.response.docs,
                'mlt':  d.data.moreLikeThis,
            }
            $rootScope.$broadcast('search-results-updated');
        },

        previousPage: function() {
            var start = this.results['page_current'] - 2;
            return this.search(this.term, start);
        },
        nextPage: function() {
            var start = this.results['page_current'];
            return this.search(this.term, start);
        },
        getCurrentPage: function() {
            return parseInt(this.results['page_current']);
        },
        getPageLast: function() {
            return parseInt(this.results['page_total']);
        },
    }
  }]);
