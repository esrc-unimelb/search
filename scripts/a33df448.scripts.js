"use strict";angular.module("searchApp",["ngCookies","ngSanitize","ngRoute","ngAnimate","ui.bootstrap"]).config(["$routeProvider","$locationProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).when("/:site",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).when("/embed",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).when("/bad/device-or-browser",{templateUrl:"views/uhoh.html",controller:""}).otherwise({redirectTo:"/"})}]),angular.module("searchApp").controller("MainCtrl",["$rootScope","$scope","$window","$location","SolrService",function(a,b,c,d,e){b.ready=!1;var f=angular.element(c);f.bind("resize",function(){b.$apply(function(){g()})});var g=function(){b.w=c.innerWidth,b.h=c.innerHeight,b.w<760?c.location.assign("/#/bad/device-or-browser"):_.isEmpty(d.path())||("/embed"===d.path()?(b.removeHeader=!0,b.t=60):(b.removeHeader=!1,b.t=145)),b.topbarStyle={position:"absolute",top:"0px",left:"0px",width:"100%","z-index":"10000",padding:"0px 10px"},b.bodypanelStyle={position:"absolute",top:b.t+"px",left:"0px",width:"100%",height:b.h-b.t+"px","overflow-y":"scroll",padding:"0px 15px"}};g(),b.$on("show-search-results-details",function(){b.detailsActive=!1}),b.$on("hide-search-results-details",function(){b.detailsActive=!0}),b.$on("site-name-retrieved",function(){"ESRC"===e.site?(b.site_name="Search the datasets.",b.site_url=d.absUrl(),b.returnToSiteLink=!1):(b.site_name="Search: "+e.site_name,b.site_url=e.site_url,b.returnToSiteLink=!0)}),b.$on("app-ready",function(){b.ready=!0,b.facetWidgets=e.configuration.facetWidgets,b.dateFacetWidgets=e.configuration.dateFacetWidgets}),b.toggleDetails=function(){e.toggleDetails()},b.clearAllFilters=function(){e.reset()},b.openAllFilters=function(){a.$broadcast("open-all-filters")},b.closeAllFilters=function(){a.$broadcast("close-all-filters")},b.search=function(){b.ready&&e.search(),b.tabs=[!0,!1]},e.init(),b.tabs=[!0,!1]}]),angular.module("searchApp").controller("ImageViewCtrl",["$scope","ImageService",function(a,b){var c=b.get();"OHRM"===c.data_type?a.single=!0:a.set=!0}]),angular.module("searchApp").directive("searchForm",["$log","SolrService",function(a,b){return{templateUrl:"views/search-form.html",restrict:"E",scope:{help:"@",searchType:"@"},link:function(a){a.$on("app-ready",function(){a.searchBox=b.query.term,a.search()}),a.$on("reset-all-filters",function(){a.searchBox="*"}),a.search=function(){_.isEmpty(a.searchBox)&&(a.searchBox="*"),b.query.term=a.searchBox,b.query.sort="*"===b.query.term?"name_sort asc":"score desc",b.search(0,!0)},a.reset=function(){b.reset()}}}}]),angular.module("searchApp").factory("SolrService",["$rootScope","$http","$routeParams","$route","$location","$timeout","$window","$log","Configuration",function a(b,c,d,e,f,g,h,i,j){function k(){var a=f.search();if(!a.config)return i.info("No external configuration referenced. Using internal configuration."),l();var b="site_configs/"+a.config+".js";c.get(b).then(function(a){return i.info("Loading external configuration."),l(a.data)},function(a){i.error("Unable to load external configuration."),i.error("Check that the URL is valid and the content is valid JSON."),i.error(a)})}function l(c){i.info("#########"),i.info("######### APPLICATION INITIALISED"),i.info("#########");var e;if(void 0!=c?e=c.site:(c=j,e=c.site,void 0!==d.site&&"embed"!==d.site&&(e=d.site)),_.isEmpty(f.search())||_.has(f.search(),"config")){var h=a.loadData();if(h){var k=o();k.configuration.site===e?(a.query=k.query,a.configuration=k.configuration,a.site=k.configuration.site):(i.info("Site stored in saved data doesn't match incoming config."),sessionStorage.removeItem("cq"),p(c,e))}else i.info("Unable to initialise from saved data."),p(c,e)}else p(c,e);return i.debug("Searching: "+a.query.site),i.debug("Query object at initialisation",a.query),i.debug("Configuration object at initialisation",a.configuration),D(),g(function(){i.info("Application bootstrapped"),b.$broadcast("app-ready")},500),!0}function m(b,c){b&&(a.configuration=angular.copy(b)),c&&(a.configuration.site=c),a.query={},a.query.site=a.configuration.site,a.query.solr=a.configuration[j.deployment]+"/"+a.configuration.site+"/select",a.query.searchFields=a.configuration.searchFields,a.query.searchWhat=_.keys(a.query.searchFields),a.query.searchType=a.configuration.searchType,a.query.searchTypeKeywordUnion=a.configuration.searchTypeKeywordUnion,a.query.term="*",a.query.filters={},a.query.dateFilters={},a.query.filterUnion={},a.query.facets={},a.query.dateFacets={}}function n(){var a=sessionStorage.getItem("cq");return angular.fromJson(b.$eval(a))}function o(){return i.info("Initialising app from saved data"),a.loadData()}function p(b,c){i.info("Bootstrapping app"),m(b,c),a.appInit=!0;var d=angular.copy(f.search());if(a.query.term=void 0!==d.q?d.q:"*",d.q&&delete d.q,d.config){var e=d.config;delete d.config}angular.forEach(d,function(b,c){if("object"==typeof b)for(var d=0;d<b.length;d++)a.filterQuery(c,b[d],!0);else a.filterQuery(c,b,!0)}),e?f.search({config:e}).replace():f.search({}).replace()}function q(b,c){var d=[];angular.forEach(a.query.searchFields,function(b,c){_.contains(a.query.searchWhat,b.fieldName)&&d.push({name:a.query.searchFields[c].fieldName,weight:a.query.searchFields[c].weight})}),_.isEmpty(a.query.term)&&(a.query.term="*");var e=a.query.term,f=[];if("*"===e||"~"===e.substr(-1,1)?angular.forEach(d,function(a){f.push(a.name+":("+e+")^"+a.weight)}):"keyword"===a.query.searchType?(e=e.replace(/ /gi," "+a.query.searchTypeKeywordUnion+" "),angular.forEach(d,function(a){f.push(a.name+":("+e+")^"+a.weight)})):angular.forEach(d,function(a){f.push(a.name+':"'+e+'"^'+a.weight)}),f=f.join(" OR "),!c){var g=z().join(" AND ");_.isEmpty(g)&&(g="")}_.isEmpty(a.query.sort)&&(a.query.sort="*"===e?"name_sort asc":"score desc");var h={url:a.query.solr,params:{q:f,start:b,rows:a.rows,wt:"json","json.wrf":"JSON_CALLBACK",fq:g,sort:a.query.sort}};return h}function r(){var b={date:Date.now(),query:a.query,configuration:a.configuration};i.debug("Storing the current query: "+b.date),i.debug(b),sessionStorage.setItem("cq",angular.toJson(b))}function s(d,e){e&&(a.suggestion=void 0,b.$broadcast("search-suggestion-removed")),void 0===d&&(d=0);var f=q(d);i.debug(f),c.jsonp(a.query.solr,f).then(function(b){t(0===b.data.response.numFound&&_.isEmpty(a.query.filters)?b:b)})}function t(c){if(void 0===c)a.results={term:a.query.term,total:0,docs:[]};else{var d,e=[];d=parseInt(c.data.responseHeader.params.start),e=_.map(c.data.response.docs,function(a,b){return a.sequenceNo=b+d,a}),a.results={dateStamp:(new Date).getTime(),term:a.query.term,total:c.data.response.numFound,start:d,docs:e}}b.$broadcast("update-all-facets"),r(),b.$broadcast("search-results-updated")}function u(){var b=a.results.start-a.rows;a.start=b,(0>b||a.start<0)&&(a.start=0,b=0),s(b)}function v(){var b=a.results.start+a.rows;a.start=b,s(b)}function w(d){var e=q(0);e.params.facet=!0,e.params["facet.field"]=d,e.params["facet.limit"]=a.facetLimit,e.params.rows=0,c.jsonp(a.query.solr,e).then(function(c){var e=[];_.each(c.data.facet_counts.facet_fields,function(a){for(var b=0;b<a.length;b+=2)e.push({name:a[b],count:a[b+1]})}),a.query.facets[d]=e,b.$broadcast(d+"-facets-updated")})}function x(b,c){_.has(a.query.filters,b)||(a.query.filters[b]=[]),_.contains(a.query.filters[b],c)?a.query.filters[b]=_.without(a.query.filters[b],c):a.query.filters[b].push(c),s()}function y(b,c,d,e,f){var g,h,i,j;g=e.split(" - ")[0],h=e.split(" - ")[1],j=void 0!==c&&void 0!==d?c+"-"+d+"-"+e.replace(" - ","_"):b+"-"+e.replace(" - ","_"),_.has(a.query.dateFilters,j)?delete a.query.dateFilters[j]:(i={from:g+"-01-01T00:00:00Z",to:h+"-12-31T23:59:59Z",facetField:b,label:e,existenceFromField:c,existenceToField:d},a.query.dateFilters[j]=i),f||s()}function z(){var b,c=[];for(b in a.query.filters){var d=a.query.filterUnion[b];_.isEmpty(a.query.filters[b])||c.push(b+':("'+a.query.filters[b].join('" '+d+' "')+'")')}var e=[];for(b in a.query.dateFilters){var f=a.query.dateFilters[b];if(!_.isEmpty(f))if(void 0!==f.existenceFromField&&void 0!==f.existenceToField){var g,g="(exist_from:["+j.datasetStart+" TO "+f.to+"]";g+=" AND ",g+="exist_to:["+f.from+" TO "+j.datasetEnd+"])",e.push(g)}else{var g=f.facetField+":["+f.from+" TO "+f.to+"]";e.push(g)}}return c.length>0&&e.length>0?c=c.concat(["("+e.join(" OR ")+")"]):e.length>0&&(c=["("+e.join(" OR ")+")"]),c}function A(){sessionStorage.removeItem("cq"),m(),s(),b.$broadcast("reset-all-filters")}function B(b){a.query.sort=b,s()}function C(d,e,f,g,h){b.$broadcast("reset-date-facets");var i;i=q(0,!0),i.params.rows=0,i.params.facet=!0,i.params["facet.range"]=d,i.params["facet.range.start"]=f+"-01-01T00:00:00Z",i.params["facet.range.end"]=g+"-12-31T23:59:59Z",i.params["facet.range.gap"]="+"+h+"YEARS",c.jsonp(a.query.solr,i).then(function(c){var f,i,j=c.data.facet_counts.facet_ranges[d].counts;i=[];var k=(new Date).getFullYear();for(f=0;f<j.length;f+=2){var l=parseInt(j[f].split("-")[0])+parseInt(h)-1;l>g&&(l=g),l>k&&(l=k),i.push({rangeStart:parseInt(j[f].split("-")[0]),rangeEnd:l,count:j[f+1]})}var m=d+"_"+e;a.query.dateFacets[m]=i,b.$broadcast(m+"-facet-data-ready")})}function D(){c.get(a.configuration.connexBackend).then(function(b){a.configuration.connexSites=b.data.sites},function(){a.configuration.connexSites=[]})}b.$on("$locationChangeStart",function(b,c,d){a.appInit||c.match("#view")||!c.match("#view")&&d.match("#view")||a.init(),a.appInit=!1});var a={query:{},results:{},rows:12,facetLimit:45,sort:void 0,hideDetails:!1,init:k,loadData:n,search:s,saveData:t,previousPage:u,nextPage:v,updateFacetCount:w,filterQuery:x,getFilterObject:z,filterDateQuery:y,reset:A,reSort:B,compileDateFacets:C};return a}]),angular.module("searchApp").service("LoggerService",["$log",function(a){return{logLevel:"ERROR",init:function(a){this.logLevel=a},log:function(b,c){a.log(b+": ",c)},debug:function(a){"DEBUG"===this.logLevel&&this.log("DEBUG",a)},info:function(a){("INFO"===this.logLevel||"DEBUG"==this.logLevel)&&this.log("INFO",a)},error:function(a){("ERROR"===this.logLevel||"INFO"===this.logLevel||"DEBUG"===this.logLevel)&&this.log("ERROR",a)}}}]),angular.module("searchApp").directive("searchResults",["$rootScope","$window","$timeout","SolrService",function(a,b,c,d){return{templateUrl:"views/search-results.html",restrict:"E",scope:{},link:function(a){a.showFilters=!1,a.site=d.site,a.summaryActive="",a.detailsActive="active",a.$watch(function(){return d.results.dateStamp},function(){a.results=d.results;var b=_.groupBy(d.results.docs,function(a){return a.thumbnail});a.gridView=_.has(b,"undefined")?!1:!0,a.filters=d.getFilterObject(),a.togglePageControls()},!0),a.$on("search-suggestion-available",function(){a.suggestion=d.suggestion}),a.$on("search-suggestion-removed",function(){a.suggestion=d.suggestion}),a.$on("show-search-results-details",function(){a.summaryActive="",a.detailsActive="active"}),a.$on("hide-search-results-details",function(){a.summaryActive="active",a.detailsActive=""}),a.setSuggestion=function(a){d.search(a,0,!0)},a.nextPage=function(){d.nextPage()},a.previousPage=function(){d.previousPage()},a.togglePageControls=function(){a.disablePrevious=0===d.results.start?!0:!1,a.disableNext=d.results.start+d.rows>=a.results.total?!0:!1},a.clearAllFilters=function(){d.clearAllFilters()}}}}]),angular.module("searchApp").directive("genericResultDisplay",["$log","SolrService",function(a,b){return{templateUrl:"views/generic-result-display.html",restrict:"E",scope:{data:"=ngModel"},link:function(a){a.showProvenance=!1,a.networkView=!1,a.imageSet=!1,a.data.reference=void 0!==a.data.display_url?a.data.display_url:a.data.id,"Finding Aid Item"===a.data.type&&void 0!==a.data.large_images&&(a.imageSet=!0,a.imageCount=a.data.small_images.length),"OHRM"===a.data.data_type&&void 0===a.data.main_type&&_.has(b.configuration.connexSites,a.data.site_code)&&"Text"!==a.data.type&&(a.networkView=!0),a.viewImageSet=function(){a.imageSetData=a.data},a.viewNetwork=function(){a.networkData=a.data}}}}]),angular.module("searchApp").directive("facetWidget",["$window","SolrService","Configuration",function(a,b){return{templateUrl:"views/facet-widget.html",restrict:"E",scope:{facetField:"@",label:"@",join:"@",isCollapsed:"@",alwaysOpen:"@"},link:function(c){c.ic=_.isUndefined(c.isCollapsed)?!0:angular.fromJson(c.isCollapsed),c.ao=_.isUndefined(c.alwaysOpen)?!1:angular.fromJson(c.alwaysOpen),b.query.filterUnion[c.facetField]=_.isUndefined(c.join)?"OR":c.join,c.smallList=!0;var d=function(){b.updateFacetCount(c.facetField)};c.$on("update-all-facets",function(){d()}),c.$on(c.facetField+"-facets-updated",function(){var a=b.query.filters[c.facetField],d=_.map(b.query.facets[c.facetField],function(b){return b.checked=!1,_.contains(a,b.name)&&(b.checked=!0,c.ic=!1),b});c.smallFacetList=d.slice(0,5),c.largeFacetList=[],c.largeFacetList.push(d.slice(0,15)),c.largeFacetList.push(d.slice(16,30)),c.largeFacetList.push(d.slice(31,45))}),c.$on("open-all-filters",function(){c.ic=!1}),c.$on("close-all-filters",function(){c.ic=!0}),c.facet=function(a){b.filterQuery(c.facetField,a)},c.showMore=function(){var b;a.innerWidth>767&&a.innerWidth<991?b="715px":a.innerWidth>992&&a.innerWidth<1199?b="970px":a.innerWidth>1200&&(b="1215px"),c.smallList=!1,c.overlay={position:"relative",width:b,"z-index":"20","background-color":"white",border:"1px solid #ccc","box-shadow":"5px 5px 4px #888888",padding:"15px"},c.underlay={position:"fixed",top:"0px",left:"0px",width:a.innerWidth,height:a.innerHeight,"background-color":"#ccc","z-index":"10",opacity:.3}},c.close=function(){c.smallList=!0},c.clearAll=function(){delete b.query.filters[c.facetField],b.search()},d()}}}]),angular.module("searchApp").constant("Configuration",{debug:!0,production:"https://solr.esrc.unimelb.edu.au",testing:"https://data.esrc.info/solr",deployment:"production",connex:"https://connex.esrc.unimelb.edu.au/#/entity",connexBackend:"https://cnex.esrc.unimelb.edu.au",site:"ESRC",searchType:"keyword",searchTypeKeywordUnion:"AND",datasetStart:"1600-01-01T00:00:00Z",datasetEnd:"2014-12-31T23:59:59Z",searchFields:{name:{fieldName:"name",displayName:"Entity Name",weight:"100"},altname:{fieldName:"altname",displayName:"Entity Alternate Name",weight:"50"},locality:{fieldName:"locality",displayName:"Locality",weight:"30"},text:{fieldName:"text",displayName:"Entity Content",weight:"10"},description:{fieldName:"description",displayName:"Resource Content",weight:"1"}},facetWidgets:[{facetField:"site_name",label:"Site",join:"OR"},{facetField:"type",label:"Entity Type",join:"OR"},{facetField:"function",label:"Entity Function",join:"AND"},{facetField:"repository",label:"Repository",join:"OR"},{facetField:"tag",label:"Tag",join:"AND"}],dateFacetWidgets:[{facetField:"exist_from",existenceFromField:"exist_from",existenceToField:"exist_to",id:"1",label:"Age of Discovery: 1400 - 1699",start:"1400",end:"1699",interval:"50"},{facetField:"exist_from",existenceFromField:"exist_from",existenceToField:"exist_to",id:"2",label:"Georgian Era: 1700 - 1879",start:"1700",end:"1879",interval:"20"},{facetField:"exist_from",existenceFromField:"exist_from",existenceToField:"exist_to",id:"3",label:"Machine Age: 1880 - 1939",start:"1880",end:"1939",interval:"10"},{facetField:"exist_from",existenceFromField:"exist_from",existenceToField:"exist_to",id:"4",label:"Atomic Age: 1940 - 1969",start:"1940",end:"1969",interval:"5"},{facetField:"exist_from",existenceFromField:"exist_from",existenceToField:"exist_to",id:"5",label:"Information Age: 1970 - present",start:"1970",interval:"5"}]}),angular.module("searchApp").directive("sortResults",["$rootScope","SolrService",function(a,b){return{templateUrl:"views/sort-results.html",restrict:"E",link:function(a){a.sortBy=b.query.sort,a.$on("search-results-updated",function(){a.sortBy=b.query.sort}),a.sort=function(){b.reSort(a.sortBy)}}}}]),angular.module("searchApp").directive("dateRangeGraph",["$rootScope","$window","SolrService",function(a,b,c){return{templateUrl:"views/date-range-graph.html",restrict:"E",link:function(b){b.startDateBoundary=void 0,b.endDateBoundary=void 0,a.$on("start-date-facet-data-ready",function(){b.dateFacets=c.startDateFacets})}}}]),angular.module("searchApp").directive("dateFacetWidget",["$log","SolrService",function(a,b){return{templateUrl:"views/date-facet-widget.html",restrict:"E",scope:{facetField:"@",existenceFromField:"@",existenceToField:"@",id:"@",label:"@",start:"@",end:"@",interval:"@",isCollapsed:"@",alwaysOpen:"@"},link:function(c){c.ao=void 0===c.alwaysOpen?!1:angular.fromJson(c.alwaysOpen),c.ic=void 0===c.isCollapsed?!0:angular.fromJson(c.isCollapsed),void 0===c.start&&a.error("start not defined. Need to pass in a year from which to start the facetting."),void 0===c.interval&&a.error("interval not defined. Need to pass in an interval for the range facetting."),void 0===c.id&&a.error("id not defined. Need to pass in an id for the range facetting."),c.facetRangeEnd=_.isEmpty(c.end)?(new Date).getFullYear():c.end,c.$on(c.facetField+"_"+c.id+"-facet-data-ready",function(){var a=b.query.dateFacets[c.facetField+"_"+c.id];c.facets=_.map(a,function(a){var d=a.rangeStart+" - "+a.rangeEnd,e=_.findWhere(b.query.dateFilters,{label:d}),f=!1;return e&&(f=!0,c.ic=!1),{start:a.rangeStart,end:a.rangeEnd,label:a.rangeStart+" - "+a.rangeEnd,count:a.count,checked:f}})}),c.$on("open-all-filters",function(){c.ic=!1}),c.$on("close-all-filters",function(){c.ic=!0}),c.$on("reset-all-filters",function(){b.compileDateFacets(c.facetField,c.id,c.start,c.facetRangeEnd,c.interval)}),c.facet=function(a,d){var e=_.findWhere(c.facets,{label:a});e.checked=!0,b.filterDateQuery(c.facetField,c.existenceFromField,c.existenceToField,a,d)},c.clearAll=function(){_.each(_.where(c.facets,{checked:!0}),function(a){c.facet(a.label,!0),_.findWhere(c.facets,{label:a.label}).checked=!1}),b.search()},b.compileDateFacets(c.facetField,c.id,c.start,c.facetRangeEnd,c.interval)}}}]),angular.module("searchApp").filter("dateFilterPrettifier",function(){return function(a){var b=a.replace(/-01-01T/g,"").replace(/-12-31T/g,"");return b=b.replace(/00:00:00Z/g,"").replace(/23:59:59Z/g,"")}}),angular.module("searchApp").directive("provenanceView",["SolrService",function(a){return{templateUrl:"views/provenance-view.html",restrict:"E",scope:{data:"="},link:function(b){b.showSolrSource=!1,a.configuration.debug&&(b.link=a.query.solr+'?q=id:"'+b.data.id+'"&spellcheck=off',b.showSolrSource=!0)}}}]),angular.module("searchApp").directive("displayDobject",["$log","ImageService",function(a,b){return{templateUrl:"views/display-dobject.html",restrict:"E",scope:{data:"=ngModel"},link:function(a){a.showImage=!1,a.data.isImage=b.isImage(a.data.fullsize),a.view=function(){a.imageData=a.data}}}}]),angular.module("searchApp").directive("displayPublication",function(){return{templateUrl:"views/display-publication.html",restrict:"E",scope:{data:"=ngModel"},link:function(){}}}),angular.module("searchApp").directive("displayArcresource",function(){return{templateUrl:"views/display-arcresource.html",restrict:"E",scope:{data:"=ngModel"},link:function(){}}}),angular.module("searchApp").directive("displayEntity",function(){return{templateUrl:"views/display-entity.html",restrict:"E",scope:{data:"=ngModel"},link:function(){}}}),angular.module("searchApp").service("ImageService",["$location",function b(a){function c(c){b.data=c,sessionStorage.setItem("view",JSON.stringify(c)),a.url("view")}function d(){if(void 0===b.data){var a=JSON.parse(sessionStorage.getItem("view"));b.data=a}return b.data}function e(){}function f(a){var b=["jpg","jpeg","png","gif"];if(void 0===a)return!1;var c=a.split(".").pop();return void 0!==c&&-1!==b.indexOf(c.toLowerCase())?!0:!1}var b={data:void 0,push:c,get:d,drop:e,isImage:f};return b}]),angular.module("searchApp").directive("viewOne",["$location","$window",function(a,b){return{templateUrl:"views/view-one.html",restrict:"E",scope:{imageData:"="},link:function(c){c.showImage=!1,c.$watch("imageData",function(){_.isEmpty(c.imageData)||(a.hash("view"),c.showImage=!0)},!0),c.$on("$locationChangeStart",function(a,b){b.match("#view")||(c.imageData=null,c.showImage=!1)}),c.close=function(){b.history.back()}}}}]),angular.module("searchApp").directive("viewSet",["$log","$window","$location","$anchorScroll","$timeout",function(a,b,c,d,e){return{templateUrl:"views/view-set.html",restrict:"E",scope:{imageSetData:"="},link:function(a){a.showImageSet=!1,a.showFilmstrip=!1;var f=angular.element(b);f.bind("resize",function(){a.$apply(function(){g()})});var g=function(){a.height=b.innerHeight,a.width=b.innerWidth,a.navbarHeight=50,a.panelHeight=.92*b.innerHeight,a.imagePaneHeight=a.panelHeight-a.navbarHeight-100,a.showFilmstrip===!0&&(a.filmstripHeight=250,a.imagePaneHeight=a.panelHeight-a.navbarHeight-a.filmstripHeight,a.imageHeight=a.filmstripHeight-20)};a.$watch("imageSetData",function(){_.isEmpty(a.imageSetData)||(c.hash("view"),a.showFilmstrip=!1,g(),a.current=0,a.loadImage(),a.showImageSet=!0)}),a.$on("$locationChangeStart",function(b,c){c.match("#view")||(a.imageSetData=null,a.showImageSet=!1)}),a.close=function(){b.history.back()},a.loadImage=function(){a.image=a.imageSetData.source+"/images/"+a.imageSetData.item_id+"/large/"+a.imageSetData.large_images[a.current],a.figureOutPaginationControls(),a.highlightThumbnail()},a.figureOutPaginationControls=function(){0===a.current?(a.showNext=!0,a.showPrevious=!1):a.current===a.imageSetData.large_images.length-1?(a.showNext=!1,a.showPrevious=!0):(a.showNext=!0,a.showPrevious=!0)},a.next=function(){a.current+=1,a.current===a.imageSetData.large_images.length-1&&(a.current=a.imageSetData.large_images.length-1),a.loadImage()},a.previous=function(){a.current-=1,0===a.current&&(a.current=0),a.loadImage()},a.jumpToStart=function(){a.current=0,a.loadImage()},a.jumpToEnd=function(){a.current=a.imageSetData.large_images.length-1,a.loadImage()},a.highlightThumbnail=function(){_.each(a.smallImages,function(b,c){b.selected="",c===a.current&&(b.selected="filmstrip-highlight-current")}),a.scrollThumbnails()},a.toggleFilmstrip=function(){a.showFilmstrip=!a.showFilmstrip,a.smallImages=_.map(a.imageSetData.small_images,function(b,c){var d="";return c===a.current&&(d="filmstrip-highlight-current"),{id:c,source:a.imageSetData.source+"/images/"+a.imageSetData.item_id+"/small/"+b,selected:d}}),g(),e(function(){a.scrollThumbnails()},100)},a.jumpToPage=function(b){a.current=b,a.loadImage()},a.scrollThumbnails=function(){var b=c.hash();c.hash(a.current),d(),c.hash(b)}}}}]),angular.module("searchApp").directive("smoothzoom",["$window","$timeout",function(){return{template:"",restrict:"A",link:function(a,b){a.init=function(){b.smoothZoom({animation_SPEED_PAN:.5,zoom_MAX:200,background_COLOR:"transparent",border_TRANSPARENCY:0,button_ALIGN:"top right",button_AUTO_HIDE:!0,button_SIZE:26,responsive:!0})},a.$watch("image_pane_height",function(){b.smoothZoom("destroy"),a.init()}),b.on("load",function(){a.init()})}}}]),angular.module("searchApp").directive("gridView",["SolrService","ImageService","$window",function(a,b){return{templateUrl:"views/grid-view.html",restrict:"E",scope:{docs:"="},link:function(a){a.$watch("docs",function(){var c=_.map(a.docs,function(a){return a.isImage=b.isImage(a.fullsize),a});a.images=[],a.images.push(c.slice(0,3)),a.images.push(c.slice(3,6)),a.images.push(c.slice(6,9)),a.images.push(c.slice(9,12))},!0),a.view=function(b){a.imageData=b}}}}]),angular.module("searchApp").filter("valueOrDash",function(){return function(a){return void 0===a?"-":a}}),angular.module("searchApp").directive("searchControls",["$log","SolrService",function(a,b){return{templateUrl:"views/search-controls.html",restrict:"E",scope:{},link:function(a){a.searchType={},a.$on("reset-all-filters",function(){a.selectAll()}),a.setSearchType=function(c){b.query.searchType=c,"phrase"===c?(a.searchType.keywordSearch=!1,a.searchType.phraseSearch=!0):(a.searchType.keywordSearch=!0,a.searchType.phraseSearch=!1,a.setSearchUnion(b.query.searchTypeKeywordUnion))},a.setSearchUnion=function(c){b.query.searchTypeKeywordUnion=c,"AND"===c?(a.keywordAnd=!0,a.keywordOr=!1):(a.keywordAnd=!1,a.keywordOr=!0)},a.updateSearchLimit=function(c){_.contains(b.query.searchWhat,c)?(b.query.searchWhat=_.without(b.query.searchWhat,c),a.searchFields[c].checked=!1):(b.query.searchWhat.push(c),a.searchFields[c].checked=!0),a.toggles()},a.selectAll=function(){b.query.searchWhat=[],_.each(a.searchFields,function(b){a.updateSearchLimit(b.fieldName)})},a.deselectAll=function(){b.query.searchWhat=_.keys(b.query.searchFields),_.each(a.searchFields,function(b){a.updateSearchLimit(b.fieldName)})},a.toggles=function(){var b=_.groupBy(a.searchFields,function(a){return a.checked});b.false&&b.true?(a.selectAllToggle=!0,a.selectNoneToggle=!0):b.false&&!b.true?(a.selectAllToggle=!0,a.selectNoneToggle=!1):(a.selectAllToggle=!1,a.selectNoneToggle=!0)},a.searchFields=b.query.searchFields,_.each(a.searchFields,function(b,c){a.searchFields[c].checked=!0}),a.setSearchType(b.query.searchType),a.selectAllToggle=!1,a.selectNoneToggle=!0}}}]),angular.module("searchApp").directive("viewNetwork",["$log","$location","$window","$sce","SolrService",function(a,b,c,d,e){return{templateUrl:"views/view-network.html",restrict:"E",scope:{networkData:"="},link:function(a){a.showNetwork=!1,a.$watch("networkData",function(){_.isEmpty(a.networkData)||(b.hash("view"),a.showNetwork=!0,a.link=d.trustAsResourceUrl(e.configuration.connex+"/"+a.networkData.site_code+"/"+a.networkData.record_id+"?link=false"))},!0),a.$on("$locationChangeStart",function(b,c){c.match("#view")||(a.networkData=null,a.showNetwork=!1)}),a.close=function(){c.history.back()}}}}]);