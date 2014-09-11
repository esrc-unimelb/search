"use strict";angular.module("searchApp",["ngCookies","ngResource","ngSanitize","ngRoute","nvd3ChartDirectives","mgcrea.ngStrap","ngAnimate"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).when("/view",{templateUrl:"views/image-view.html",controller:"ImageViewCtrl"}).when("/:site",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]),angular.module("searchApp").controller("MainCtrl",["$scope","$window","$routeParams","$location","SolrService",function(a,b,c,d,e){a.site=void 0!==c.site?c.site:"ESRC";var f=angular.element(b);f.bind("resize",function(){a.$apply(function(){g()})});var g=function(){a.w=b.innerWidth,a.h=b.innerHeight,a.t=a.w<760?152:152,a.lpw=Math.floor(.25*a.w)-1,a.rpw=a.w-a.lpw-1};g(),a.$on("show-search-results-details",function(){a.detailsActive=!1}),a.$on("hide-search-results-details",function(){a.detailsActive=!0}),a.$on("site-name-retrieved",function(){"ESRC"===e.site?(a.site_name="Search our data",a.site_url=d.absUrl(),a.returnToSiteLink=!1):(a.site_name="Search: "+e.site_name,a.site_url=e.site_url,a.returnToSiteLink=!0)}),a.toggleDetails=function(){e.toggleDetails()}}]),angular.module("searchApp").controller("ImageViewCtrl",["$scope","ImageService",function(a,b){var c=b.get();"OHRM"===c.data_type?a.single=!0:a.set=!0}]),angular.module("searchApp").directive("searchForm",["$routeParams","$timeout","$location","SolrService",function(a,b,c,d){return{templateUrl:"views/search-form.html",restrict:"E",scope:{help:"@",deployment:"@",site:"@",searchType:"@"},link:function(b){b.$on("app-ready",function(){b.searchBox=d.term,b.setSearchType(d.searchType!==b.searchType?d.searchType:b.searchType)}),b.setSearchBox=function(){if(void 0!==a.q)if(angular.isArray(a.q)){var d=c.search();b.searchBox=a.q[0],c.search("q",d.q[0])}else b.searchBox=a.q;else b.searchBox="*"},b.search=function(){""===b.searchBox&&(b.searchBox="*"),d.search(b.searchBox,0,!0)},b.setSearchType=function(a){d.searchType=a,"phrase"===d.searchType?(b.keywordSearch=!1,b.phraseSearch=!0):(b.phraseSearch=!1,b.keywordSearch=!0),b.search()},b.setSearchBox(),b.ready=d.init(b.deployment,b.site)}}}]),angular.module("searchApp").factory("SolrService",["$rootScope","$http","$routeParams","$route","$location","$timeout","$window","LoggerService","Configuration",function a(b,c,d,e,f,g,h,i,j){function k(b,c){i.init(j.loglevel),i.info("############"),i.info("############ APPLICATION INITIALISED"),i.info("############"),a.site=c,a.filters={},a.dateFilters={},a.results={},a.facets={},a.searchType="keyword",void 0===b&&"production"!==b&&(b="production"),void 0===c?(a.site=j.defaultSite,a.solr=j[b]+"/"+j.defaultSite+"/select"):a.solr=j[b]+"/"+c+"/select",a.deployment=b,i.debug("Solr Service: "+a.solr),i.debug("Site: "+a.site),a.dateOuterBounds(),n(),E()>0&&sessionStorage.removeItem("cq");var d=JSON.parse(sessionStorage.getItem("cq"));null!==d&&d.site!==a.site&&sessionStorage.removeItem("cq");var d=sessionStorage.getItem("cq");return null!==d?l(d):m(),!0}function l(c){c=JSON.parse(c),a.appInit=!0,i.info("Initialising app from saved data"),a.q=c.q,a.filters=c.filters,a.term=c.term,a.searchType=c.searchType,a.sort=c.sort,g(function(){b.$broadcast("app-ready"),a.appInit=!1},300)}function m(){a.appInit=!0,i.info("Bootstrapping app"),a.term=void 0!==d.q?d.q:"*",angular.forEach(d,function(b,c){if(-1!==j.allowedRouteParams.indexOf(c)&&"q"!==c){if("object"==typeof b)for(var d=0;d<b.length;d++)a.filterQuery(c,b[d],!0);else a.filterQuery(c,b,!0);a.updateFacetCount(c)}}),angular.forEach(d,function(a,b){-1!==j.allowedRouteParams.indexOf(b)&&f.search(b,null)}),g(function(){b.$broadcast("app-ready"),a.appInit=!1},300)}function n(){if("ESRC"!==a.site){var d={url:a.solr,params:{q:"*:*",rows:1,wt:"json","json.wrf":"JSON_CALLBACK"}};c.jsonp(a.solr,d).then(function(c){a.site_name=c.data.response.docs[0].site_name,a.site_url=c.data.response.docs[0].site_url,i.debug("Searching site: "+a.site_name),b.$broadcast("site-name-retrieved")})}else b.$broadcast("site-name-retrieved")}function o(b){var c,d,e=a.term;"*"===e||"~"===e.substr(-1,1)?c="(name:"+e+"^20 OR altname:"+e+"^10 OR locality:"+e+"^10 OR text:"+e+")":"keyword"===a.searchType?(e=e.replace(/ /gi," AND "),c="name:("+e+")^100 OR altname:("+e+")^50 OR locality:("+e+")^10 OR text:("+e+")"):c='name:"'+e+'"^100 OR altname:"'+e+'"^50 OR locality:"'+e+'"^10 OR text:"'+e+'"';var f=y().join(" AND ");return void 0===f&&(f=""),d=void 0===a.sort?"*"===e?"name_sort asc":"score desc":a.sort,a.resultSort=d,c={url:a.solr,params:{q:c,start:b,rows:a.rows,wt:"json","json.wrf":"JSON_CALLBACK",fq:f,sort:d}},a.q=c,a.q}function p(){var b={date:Date.now(),term:a.term,q:o(0),filters:a.filters,searchType:a.searchType,sort:a.sort,site:a.site};i.debug("Storing the current query: "+b.date),sessionStorage.setItem("cq",JSON.stringify(b))}function q(d,e,f,g){f&&(a.suggestion=void 0,b.$broadcast("search-suggestion-removed")),(d!==a.term||0===e)&&(a.results.docs=[],a.results.start=0),a.term=d;var h=o(e);i.debug(h),(g||void 0===g)&&p(),c.jsonp(a.solr,h).then(function(b){0===b.data.response.numFound&&0===Object.keys(a.filters).length?1===d.split(" ").length?(r(a.term),"*"!==d&&"~"!==d.substr(-1,1)&&q(d+"~",0,!1)):s(void 0):s(b)})}function r(d){var e;e={url:a.solr,params:{q:"name:"+d,rows:0,wt:"json","json.wrf":"JSON_CALLBACK"}},i.debug("Suggest: "),i.debug(e),c.jsonp(a.solr,e).then(function(c){a.suggestion=c.data.spellcheck.suggestions[1].suggestion[0],b.$broadcast("search-suggestion-available")})}function s(c){if(void 0===c)a.results={term:a.term,total:0,docs:[]};else{var d,e;if(void 0===a.results.docs)d=c.data.response.docs;else for(d=a.results.docs,e=0;e<c.data.response.docs.length;e++)d.push(c.data.response.docs[e]);for(e=0;e<d.length;e++)d[e].sequenceNo=e;a.results={term:a.term,total:c.data.response.numFound,start:parseInt(c.data.responseHeader.params.start),docs:d}}v(),D(),b.$broadcast("search-results-updated")}function t(){var b=a.results.start+a.rows;q(a.term,b)}function u(d){var e=o(0);e.params.facet=!0,e.params["facet.field"]=d,e.params.rows=0,c.jsonp(a.solr,e).then(function(c){angular.forEach(c.data.facet_counts.facet_fields,function(c,d){for(var e=[],f=0;f<c.length;f+=2)e.push([c[f],c[f+1],!1]);a.facets[d]=e,b.$broadcast(d+"-facets-updated")})})}function v(){angular.forEach(a.facets,function(b,c){a.updateFacetCount(c)})}function w(b,c,d){if(void 0===a.filters[b])a.filters[b]=[c];else if(-1===a.filters[b].indexOf(c))a.filters[b].push(c);else{var e=a.filters[b].indexOf(c);a.filters[b].splice(e,1),0===a.filters[b].length&&delete a.filters[b]}d!==!0&&(a.results.docs=[],a.results.start=0,q(a.term,0,!0))}function x(b){var c,d,e;c=b,d=parseInt(b)+9,a.dateFilters[c]?delete a.dateFilters[c]:(e={from:c+"-01-01T00:00:00Z",to:d+"-12-31T23:59:59Z"},a.dateFilters[c]=e),a.results.docs=[],a.results.start=0,q(a.term,0,!0)}function y(){var b,c=[];for(b in a.filters){var d=a.filterUnion[b];c.push(b+':("'+a.filters[b].join('" '+d+' "')+'")')}var e=[];for(b in a.dateFilters){var f=a.dateFilters[b],g="(exist_to:["+f.from+" TO "+a.dateEndBoundary+"]";g+=" AND ",g+="exist_from:["+a.dateStartBoundary+" TO "+f.to+"])",e.push(g)}return c.length>0&&e.length>0?c=c.concat([e.join(" OR ")]):e.length>0&&(c=[e.join(" OR ")]),c}function z(){a.filters={},a.dateFilters={},q(a.term,0,!0),b.$broadcast("reset-all-filters")}function A(){a.hideDetails=!a.hideDetails,b.$broadcast(a.hideDetails===!0?"hide-search-results-details":"show-search-results-details")}function B(){q(a.term,0)}function C(){var b={url:a.solr,params:{q:"*:*",start:0,rows:1,wt:"json","json.wrf":"JSON_CALLBACK",sort:"exist_from asc"}};c.jsonp(a.solr,b).then(function(b){a.dateStartBoundary=b.data.response.docs[0].exist_from;var d={url:a.solr,params:{q:"*:*",start:0,rows:1,wt:"json","json.wrf":"JSON_CALLBACK",sort:"exist_from desc"}};c.jsonp(a.solr,d).then(function(b){a.dateEndBoundary=b.data.response.docs[0].exist_to,a.compileDateFacets()})})}function D(){b.$broadcast("reset-date-facets");var d,e;d=o(0),d.params.rows=0,d.params.facet=!0,d.params["facet.range"]="date_from",d.params["facet.range.gap"]="+10YEARS";var f;f=a.dateStartBoundary.split("-")[0],f-=f.substr(3,1),d.params["facet.range.start"]=f+"-01-01T00:00:00Z",void 0!==a.dateEndBoundary&&(d.params["facet.range.end"]=a.dateEndBoundary,c.jsonp(a.solr,d).then(function(c){var d,e,f=c.data.facet_counts.facet_ranges.date_from.counts;for(e=[],d=0;d<f.length;d+=2)e.push([f[d].split("-")[0],f[d+1]]);a.startDateFacets=[{key:"",values:e}],b.$broadcast("start-date-facet-data-ready")})),e=o(),e.params.rows=0,e.params.facet=!0,e.params["facet.range"]="date_to",e.params["facet.range.gap"]="+10YEARS",e.params["facet.range.start"]=f+"-01-01T00:00:00Z",void 0!==a.dateEndBoundary&&(e.params["facet.range.end"]=a.dateEndBoundary,c.jsonp(a.solr,e).then(function(c){var d,e,f=c.data.facet_counts.facet_ranges.date_to.counts;for(e=[],d=0;d<f.length;d+=2)e.push([f[d].split("-")[0],f[d+1]]);a.endDateFacets=[{key:"",values:e}],b.$broadcast("end-date-facet-data-ready")}))}var E=function(){var a=[];return angular.forEach(f.search(),function(b){a.push(b)}),a.length};b.$on("$routeUpdate",function(){if(!a.appInit)if(d.site!==a.site||E()>0)sessionStorage.removeItem("cq"),k(a.deployment,d.site);else{var b=sessionStorage.getItem("cq");null!==b?l(sessionStorage.getItem("cq")):k(a.deployment,d.site)}});var a={results:{},facets:{},filters:{},filterUnion:{},dateFilters:{},searchType:"phrase",term:"*",rows:10,sort:void 0,resultSort:void 0,hideDetails:!1,init:k,search:q,saveData:s,nextPage:t,updateFacetCount:u,filterQuery:w,getFilterObject:y,filterDateQuery:x,clearAllFilters:z,toggleDetails:A,reSort:B,dateOuterBounds:C,compileDateFacets:D};return a}]),angular.module("searchApp").service("LoggerService",function(){return{logLevel:"ERROR",init:function(a){this.logLevel=a},log:function(a,b){console.log(a+": ",b)},debug:function(a){"DEBUG"===this.logLevel&&this.log("DEBUG",a)},info:function(a){("INFO"===this.logLevel||"DEBUG"==this.logLevel)&&this.log("INFO",a)},error:function(a){("ERROR"===this.logLevel||"INFO"===this.logLevel||"DEBUG"===this.logLevel)&&this.log("ERROR",a)}}}),angular.module("searchApp").directive("searchResults",["$rootScope","$window","SolrService",function(a,b,c){return{templateUrl:"views/search-results.html",restrict:"E",scope:{displayProvenance:"@"},link:function(b){b.showFilters=!1,b.site=c.site,b.summaryActive="",b.detailsActive="active",a.$on("search-results-updated",function(){b.results=c.results,b.filters=c.getFilterObject(),b.results.docs.length!==parseInt(b.results.total)&&(b.scrollDisabled=!1)}),a.$on("search-suggestion-available",function(){b.suggestion=c.suggestion}),a.$on("search-suggestion-removed",function(){b.suggestion=c.suggestion}),a.$on("show-search-results-details",function(){b.summaryActive="",b.detailsActive="active"}),a.$on("hide-search-results-details",function(){b.summaryActive="active",b.detailsActive=""}),b.setSuggestion=function(a){c.search(a,0,!0)},b.loadNextPage=function(){c.nextPage()},b.clearAllFilters=function(){c.clearAllFilters()}}}}]),angular.module("searchApp").directive("genericResultDisplay",["$rootScope","$location","SolrService","ImageService",function(a,b,c,d){return{templateUrl:"views/generic-result-display.html",restrict:"E",scope:{data:"=ngModel",displayProvenance:"@"},link:function(b){b.hideDetails=c.hideDetails,a.$on("hide-search-results-details",function(){b.hideDetails=!0}),a.$on("show-search-results-details",function(){b.hideDetails=!1}),b.data.url=void 0!==b.data.display_url?b.data.display_url:b.data.id,"Finding Aid Item"===b.data.type&&void 0!==b.data.large_images&&(b.imageSet=!0,b.imageCount=b.data.small_images.length),b.view=function(){d.push(b.data)}}}}]),angular.module("searchApp").directive("facetWidget",["SolrService",function(a){return{templateUrl:"views/facet-widget.html",restrict:"E",scope:{facetField:"@",label:"@",join:"@"},link:function(b){b.$on("app-ready",function(){a.updateFacetCount(b.facetField)}),void 0===b.join&&(b.join="OR"),a.filterUnion[b.facetField]=b.join,b.displayLimit=8,b.$on(b.facetField+"-facets-updated",function(){var c=a.filters[b.facetField];void 0===c?c=[]:b.isCollapsed=!0;var d,e=a.facets[b.facetField];for(d=0;d<e.length;d++)-1!==c.indexOf(e[d][0])&&(e[d][2]=!0);for(d=0;d<e.length;d++)e=0===e[d][1]&&d<b.displayLimit?e.slice(0,d):e.slice(0,b.displayLimit);b.facets=e,a.facets[b.facetField].length>b.displayLimit&&(b.moreResults=!0)}),b.$on("reset-all-filters",function(){for(var a=0;a<b.facets.length;a++)b.facets[a][2]=!1,b.selected=[]}),b.showAll=function(){b.facets=a.facets[b.facetField],b.moreResults=!1},b.facet=function(c){a.filterQuery(b.facetField,c)}}}}]),angular.module("searchApp").constant("Configuration",{production:"https://data.esrc.unimelb.edu.au/solr",testing:"https://data.esrc.info/solr",loglevel:"DEBUG",allowedRouteParams:["q","type","function"],defaultSite:"ESRC"}),angular.module("searchApp").directive("sortResults",["$rootScope","SolrService",function(a,b){return{templateUrl:"views/sort-results.html",restrict:"E",link:function(c){c.sortBy=b.resultSort,a.$on("search-results-updated",function(){c.sortBy=b.resultSort}),c.sort=function(){b.sort=c.sortBy,b.reSort()}}}}]),angular.module("searchApp").directive("dateRangeGraph",["$rootScope","$window","SolrService",function(a,b,c){return{templateUrl:"views/date-range-graph.html",restrict:"E",link:function(b){b.startDateBoundary=void 0,b.endDateBoundary=void 0,a.$on("start-date-facet-data-ready",function(){b.dateFacets=c.startDateFacets})}}}]),angular.module("searchApp").directive("dateFacetWidget",["$rootScope","SolrService",function(a,b){return{templateUrl:"views/date-facet-widget.html",restrict:"E",link:function(c){c.facets={},c.selected=[],a.$on("reset-date-facets",function(){c.facets={}}),a.$on("start-date-facet-data-ready",function(){var a=b.startDateFacets[0].values;d(a),e()}),a.$on("end-date-facet-data-ready",function(){var a=b.endDateFacets[0].values;d(a),e()}),a.$on("reset-all-filters",function(){c.selected=[],e()});var d=function(a){for(var b=0;b<a.length;b++){var d=parseInt(a[b][0]),e=parseInt(a[b][0])+10,f=parseInt(a[b][0])+9,g={start:d,end:e,label:d+" - "+f};c.facets[a[b][0]]=g}},e=function(){for(var a in c.facets)c.facets[a].checked=-1!==c.selected.indexOf(parseInt(a))?!0:!1};c.facet=function(a){b.filterDateQuery(a),-1===c.selected.indexOf(a)?c.selected.push(a):c.selected.splice(c.selected.indexOf(a),1)}}}}]),angular.module("searchApp").filter("dateFilterPrettifier",function(){return function(a){var b=a.replace(/-01-01T/g,"").replace(/-12-31T/g,"");return b=b.replace(/00:00:00Z/g,"").replace(/23:59:59Z/g,"")}}),angular.module("searchApp").directive("provenanceView",function(){return{templateUrl:"views/provenance-view.html",restrict:"E",scope:{data:"=",displayProvenance:"@"},link:function(){}}}),angular.module("searchApp").directive("displayDobject",["$window","$location","ImageService","LoggerService",function(a,b,c,d){return{templateUrl:"views/display-dobject.html",restrict:"E",scope:{data:"=ngModel"},link:function(a){a.isImage=!1;var b=["jpg","jpeg","png","gif"];if(void 0===a.data.fullsize)d.error("No full size image for: "+a.data.id);else{var e=a.data.fullsize,f=e.split("/"),g=f.pop();f=g.split(".").pop(),void 0!==f&&-1!==b.indexOf(f.toLowerCase())?a.isImage=!0:d.error("Doesn't look like an image so skipping it: "+g)}a.view=function(){c.push(a.data)}}}}]),angular.module("searchApp").directive("displayPublication",function(){return{templateUrl:"views/display-publication.html",restrict:"E",scope:{data:"=ngModel"},link:function(){}}}),angular.module("searchApp").directive("displayArcresource",function(){return{templateUrl:"views/display-arcresource.html",restrict:"E",scope:{data:"=ngModel"},link:function(){}}}),angular.module("searchApp").directive("displayEntity",function(){return{templateUrl:"views/display-entity.html",restrict:"E",scope:{data:"=ngModel"},link:function(){}}}),angular.module("searchApp").service("ImageService",["$location",function b(a){function c(c){b.data=c,sessionStorage.setItem("view",JSON.stringify(c)),a.url("view")}function d(){if(void 0===b.data){var a=JSON.parse(sessionStorage.getItem("view"));b.data=a}return b.data}function e(){}var b={data:void 0,push:c,get:d,drop:e};return b}]),angular.module("searchApp").directive("viewOne",["$window","ImageService",function(a,b){return{templateUrl:"views/view-one.html",restrict:"E",scope:{},link:function(c){c.showLoadingIndicator=!0,c.showImage=null,c.data=b.get();var d=angular.element(a);d.bind("resize",function(){c.$apply(function(){e()})});var e=function(){c.height=a.innerHeight,c.width=a.innerWidth,c.image_pane_height=.9*a.innerHeight,c.image_label_height=a.innerHeight-c.image_pane_height};e();var f=new Image;f.onload=function(){c.$apply(function(){c.showLoadingIndicator=null,c.showImage=!0,c.showDetails=!0})},f.src=c.data.fullsize,c.back=function(){a.history.back()}}}}]),angular.module("searchApp").directive("viewSet",["$window","$location","$anchorScroll","$timeout","ImageService",function(a,b,c,d,e){return{templateUrl:"views/view-set.html",restrict:"E",scope:{},link:function(f){f.showFilmstrip=!0,f.showInformation=!1,f.data=e.get();var g=angular.element(a);g.bind("resize",function(){f.$apply(function(){h(),f.loadImage(f.current)})});var h=function(){f.height=a.innerHeight,f.width=a.innerWidth,f.navbar_height=50,f.showFilmstrip===!0?(f.image_pane_height=.8*(a.innerHeight-f.navbar_height),f.filmstrip_height=a.innerHeight-f.navbar_height-f.image_pane_height):f.image_pane_height=a.innerHeight-f.navbar_height};h(),f.smallImages=[],f.largeImageMap={},f.styleMap={},f.largeImageById=[],angular.forEach(f.data.large_images,function(a){var b=a.split("_");f.largeImageMap[b[1]]=f.data.site_url+"/images/"+f.data.item_id+"/large/"+a,f.styleMap[b[1]]="",f.largeImageById.push(b[1])}),angular.forEach(f.data.small_images,function(a){f.smallImages.push({id:a.split("_")[1],src:f.data.site_url+"/images/"+f.data.item_id+"/small/"+a})}),f.loadImage=function(a){f.show=!1,f.styleMap[f.current]="",f.styleMap[a]="highlight-current",f.image=f.largeImageMap[a],f.current=a,f.displaying=f.largeImageById.indexOf(f.current)+1+" of "+f.largeImageById.length;var e=b.hash();b.hash(a),c(),b.hash(e),d(function(){f.show=!0},100),0==f.largeImageById.indexOf(f.current)?(f.showNext=!0,f.showPrevious=!1):f.largeImageById.indexOf(f.current)==f.largeImageById.length-1?(f.showNext=!1,f.showPrevious=!0):(f.showNext=!0,f.showPrevious=!0)};var i=f.data.large_images[0];f.current=i.split("_")[1],f.loadImage(f.current),f.next=function(){var a=f.largeImageById.indexOf(f.current);if(a<f.largeImageById.length-1){var b=f.largeImageById[a+1];f.loadImage(b)}},f.previous=function(){var a=f.largeImageById.indexOf(f.current);if(a>0){var b=f.largeImageById[a-1];f.loadImage(b)}},f.jumpToStart=function(){var a=f.largeImageById[0];f.loadImage(a)},f.jumpToEnd=function(){var a=f.largeImageById[f.largeImageById.length-1];f.loadImage(a)},f.toggleFilmstrip=function(){f.showFilmstrip=!f.showFilmstrip,h()},f.toggleInformation=function(){f.showInformation=!f.showInformation}}}}]),angular.module("searchApp").directive("smoothzoom",["$window",function(){return{templateUrl:"views/smoothzoom-view.html",restrict:"A",link:function(a,b){a.init=function(){b.smoothZoom({animation_SPEED_ZOOM:.5,animation_SPEED_PAN:.5,animation_SMOOTHNESS:5,zoom_MAX:400,background_COLOR:"black",button_ALIGN:"top right",button_AUTO_HIDE:!0,button_SIZE:26,responsive:!0})},a.$watch("image_pane_height",function(){b.smoothZoom("destroy"),a.init()}),a.$watch("element.src",function(){a.init()})}}}]);