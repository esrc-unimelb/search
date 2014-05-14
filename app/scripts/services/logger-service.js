'use strict';

/**
 * @ngdoc service
 * @name LoggerService
 * @description
 *  Logging service.
 */
angular.module('searchApp')
  .service('LoggerService', function LoggerService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
        log_level: 'ERROR',

        /** @ngdoc function
         *  @name LoggerService.service:init
         *  @description
         *      Initialise the level. Default is ERROR.
         */
        init: function(level) {
            this.log_level = level;
        },

        log: function(level, msg) {
            console.log(level + ': ', msg);
        },

        /** @ngdoc function
         *  @name LoggerService.service:debug
         *  @description
         *      Log a message at level DEBUG
         *  @param {string} msg - The message to log
         */
        debug: function(msg) {
            if (this.log_level === 'DEBUG') {
                this.log('DEBUG', msg);
            }
        },

        /** @ngdoc function
         *  @name LoggerService.service:info
         */
         *  @description
         *      Log a message at level INFO
         *  @param {string} msg - The message to log
        info: function(msg) {
            if (this.log_level === 'INFO') {
                this.log('INFO', msg);
            }
        },

        /** @ngdoc function
         *  @name LoggerService.service:error
         */
         *  @description
         *      Log a message at level ERROR
         *  @param {string} msg - The message to log
        error: function(msg) {
            if (this.log_level === 'ERROR') {
                this.log('ERROR',  msg);
            }
        },
    }

  });
