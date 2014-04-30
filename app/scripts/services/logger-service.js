'use strict';

angular.module('searchApp')
  .service('LoggerService', function LoggerService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
        log_level: 'ERROR',

        init: function(level) {
            this.log_level = level;
        },

        log: function(level, msg) {
            console.log(level + ': ', msg);
        },

        debug: function(msg) {
            if (this.log_level === 'DEBUG') {
                this.log('DEBUG', msg);
            }
        },

        info: function(msg) {
            if (this.log_level === 'INFO') {
                this.log('INFO', msg);
            }
        },

        error: function(msg) {
            if (this.log_level === 'ERROR') {
                this.log('ERROR',  msg);
            }
        },
    }

  });
