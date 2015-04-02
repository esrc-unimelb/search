'use strict';

/**
 * @ngdoc directive
 * @name searchApp.directive:searchControls
 * @description
 * # searchControls
 */
angular.module('searchApp')
  .directive('searchControls', [ '$log', 'SolrService', function ($log, SolrService) {
    return {
      templateUrl: 'views/search-controls.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {

          scope.$on('app-ready', function() {
              // set up what is going to be searched
              //  on load - everything
              scope.selectAll();

              // get the search fields from the SolrService
              scope.searchFields = SolrService.searchFields;

              // set the search type and union
              scope.setSearchType(SolrService.configuration.searchType);

              scope.selectAllToggle = false;
              scope.selectNoneToggle = true;
          });

          // directive initialisation
          scope.searchWhat = [];

          // keyword or phrase search ?
          scope.setSearchType = function(type) {
              SolrService.searchType = type;
              if (SolrService.searchType === 'phrase') {
                  scope.keywordSearch = false;
                  scope.phraseSearch = true;
              } else {
                  scope.phraseSearch = false;
                  scope.keywordSearch = true;
                  scope.setSearchUnion(SolrService.configuration.keywordSearchOperator);
              }
              //scope.search();
          }

          // set the union for keyword search
          scope.setSearchUnion = function(union) {
              SolrService.keywordUnion = union;
              if (SolrService.keywordUnion === 'AND') {
                  scope.keywordAnd = true;
                  scope.keywordOr = false;
              } else {
                  scope.keywordAnd = false;
                  scope.keywordOr = true;
              }
          }

          // toggle what get's searched
          //  if what is in the list - remove it
          //  if not in list - add it
          scope.updateSearchLimit = function(what) {
              if (SolrService.searchWhat.indexOf(what) === -1) {
                  scope.searchWhat[what] = true;
                  SolrService.searchWhat.push(what);
              } else {
                  scope.searchWhat[what] = false;
                  SolrService.searchWhat.splice(SolrService.searchWhat.indexOf(what), 1);
              }

              if (SolrService.searchWhat.length === 0) {
                  scope.selectAllToggle = true;
                  scope.selectNoneToggle = false;
              } else if (scope.searchWhat.length === SolrService.searchWhat.length) {
                  scope.selectAllToggle = false;
                  scope.selectNoneToggle = true;
              } else {
                  scope.selectAllToggle = true;
                  scope.selectNoneToggle = true;
              }
          }

          // search all listed fields
          scope.selectAll = function() {
              angular.forEach(SolrService.searchFields, function(v,k) {
                  if (scope.searchWhat[k] === undefined || !scope.searchWhat[k]) {
                    scope.updateSearchLimit(k);
                  }
              })
          }

          // search none of the listed fields (this amounts
          //  to a blank search)
          scope.deselectAll = function() {
              angular.forEach(scope.searchWhat, function(v,k) {
                  if (v) scope.updateSearchLimit(k.toString());
              });
          }
      }
    };
  }]);
