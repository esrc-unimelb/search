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
          scope.searchType = {};
          scope.$on('reset-all-filters', function() {
              scope.selectAll();
          })

          // keyword or phrase search ?
          scope.setSearchType = function(type) {
              // store the type in the service
              SolrService.query.searchType = type;

              // do some toggling
              if (type === 'phrase') {
                  scope.searchType.keywordSearch = false;
                  scope.searchType.phraseSearch = true;
              } else {
                  scope.searchType.keywordSearch = true;
                  scope.searchType.phraseSearch = false;
                  scope.setSearchUnion(SolrService.query.searchTypeKeywordUnion);
              }
              //scope.search();
          }

          // set the union for keyword search
          scope.setSearchUnion = function(union) {
              SolrService.query.searchTypeKeywordUnion = union;
              if (union === 'AND') {
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
              if (_.contains(SolrService.query.searchWhat, what)) {
                  // true - ie it's selected - deselect it
                  SolrService.query.searchWhat = _.without(SolrService.query.searchWhat, what);
                  scope.searchFields[what].checked = false
              } else {
                  SolrService.query.searchWhat.push(what);
                  scope.searchFields[what].checked = true; 

              }

              // figure out the toggle situation
              scope.toggles();
          }

          // search all listed fields
          scope.selectAll = function() {
              SolrService.query.searchWhat = [];
              _.each(scope.searchFields, function(d) { scope.updateSearchLimit(d.fieldName); });
          }

          // search none of the listed fields (this amounts
          //  to a blank search)
          scope.deselectAll = function() {
              SolrService.query.searchWhat = _.keys(SolrService.query.searchFields);
              _.each(scope.searchFields, function(d) { scope.updateSearchLimit(d.fieldName); });
          }

          scope.toggles = function() {
              // which toggles need to be on / off
              var toggled = _.groupBy(scope.searchFields, function(d) { return d.checked; });

              if (toggled.false && toggled.true) {
                  // some on, some off
                  scope.selectAllToggle = true;
                  scope.selectNoneToggle = true;
              } else if (toggled.false && !toggled.true) {
                  // all off
                  scope.selectAllToggle = true;
                  scope.selectNoneToggle = false;
              } else {
                  // all on
                  scope.selectAllToggle = false;
                  scope.selectNoneToggle = true;
              }
          }


          // get the search fields from the SolrService
          scope.searchFields = SolrService.query.searchFields;
          _.each(scope.searchFields, function(d, i) {
              scope.searchFields[i].checked = true;
          });

          // set the search type based on the conf in solr service
          scope.setSearchType(SolrService.query.searchType);

          scope.selectAllToggle = false;
          scope.selectNoneToggle = true;


      }
    };
  }]);
