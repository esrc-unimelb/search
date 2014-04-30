'use strict';

angular.module('searchApp')
  .service('SolrService', [ '$rootScope', '$http', 'LoggerService', 
        function SolrService($rootScope, $http, log) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
        log_level: 'DEBUG',
        results: {},

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
        search: function(what) {
            if (what.split(' ').length > 1) {
                var q = 'name:"' + what + '"^10 OR text:"' + what + '"';
            } else {
                var q = 'name:' + what + '^10 OR text:' + what + '';
            }

            // do we have a phrase or a word?
            q = this.solr + '?q=' + q + '&fl=*,score&mlt=on&mlt.count=3&json.wrf=JSON_CALLBACK';
            log.debug(q);

            return $http.jsonp(q);
        },

        getResults: function() {
            return this.results;
        },

        saveData: function(term, d) {
            this.results = {
                'term': term,
                'total': d.data.response.numFound,
                'page_current': d.data.response.start+1,
                'page_total': parseInt(d.data.response.numFound / d.data.response.docs.length),
                'docs': d.data.response.docs,
                'mlt':  d.data.moreLikeThis,
                'hlt':  d.data.highlighting
            }
            console.log(this.results);
            $rootScope.$broadcast('search-results-updated');
        }
    }
  }]);
