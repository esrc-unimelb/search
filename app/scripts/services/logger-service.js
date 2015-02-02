'use strict';

/**
 * @ngdoc service
 * @name LoggerService
 * @description
 *  Logging service.
 */
angular.module('searchApp')
  .service('LoggerService', [ '$log', function LoggerService($log) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
        logLevel: 'ERROR',

        /** @ngdoc function
         *  @name LoggerService.service:init
         *  @description
         *      Initialise the level. Default is ERROR.
         */
        init: function(level) {
            this.logLevel = level;
        },

        log: function(level, msg) {
            $log.log(level + ': ', msg);
        },

        /** @ngdoc function
         *  @name LoggerService.service:debug
         *  @description
         *      Log a message at level DEBUG
         *  @param {string} msg - The message to log
         */
        debug: function(msg) {
            if (this.logLevel === 'DEBUG') {
                this.log('DEBUG', msg);
            }
        },

        /** @ngdoc function
         *  @name LoggerService.service:info
         *
         *  @description
         *      Log a message at level INFO
         *  @param {string} msg - The message to log
         */
        info: function(msg) {
            if (this.logLevel === 'INFO' || this.logLevel == 'DEBUG') {
                this.log('INFO', msg);
            }
        },

        /** @ngdoc function
         *  @name LoggerService.service:error
         *
         *  @description
         *      Log a message at level ERROR
         *  @param {string} msg - The message to log
         */
        error: function(msg) {
            if (this.logLevel === 'ERROR' || this.logLevel === 'INFO' || this.logLevel === 'DEBUG') {
                this.log('ERROR',  msg);
            }
        },
    };

  }]);
