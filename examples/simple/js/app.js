(function(angular) {
    'use strict';

// Declare app level module which depends on filters, and services
angular.module('BridgeExample', 
	['Centralway.lungo-angular-bridge'
	, 'BridgeExample.filters', 'BridgeExample.services', 'BridgeExample.directives', 'BridgeExample.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // First section is embedded in index.html, so no parameters
    $routeProvider.when('/section1', {});
    // Dynamic section is loaded via lab-view
    $routeProvider.when('/dynamic', { templateUrl: 'examples/simple/partials/dynamic.html', controller: 'DynamicCtrl'});
    // Demo of using query parameters for search terms
    $routeProvider.when('/search', { templateUrl: 'examples/simple/partials/search.html', controller: 'SearchCtrl'});
    // Demo of using IDs within URLs - The number 2 is used in order to catch that specific URL for E2E Testing
    $routeProvider.when('/person/view/2', { templateUrl: '/examples/simple/partials/dynamicPerson.html', controller: 'DynamicPersonCtrl'});
    // Demo of using IDs within URLs - note the section ID then article ID and **then** the person ID
    $routeProvider.when('/person/view/:personId', { templateUrl: '/examples/simple/partials/person.html', controller: 'PersonCtrl'});
    
    $routeProvider.when('/navbarissue', {templateUrl: 'examples/simple/partials/navbarissue.html'});
    $routeProvider.when('/navbarissue/navart1', {templateUrl: 'examples/simple/partials/navbarissue.html'});
    $routeProvider.when('/navbarissue/navart2', {templateUrl: 'examples/simple/partials/navbarissue.html'});
    $routeProvider.when('/navbarissue/navart3', {templateUrl: 'examples/simple/partials/navbarissue.html'});
    
    $routeProvider.when('/eventtimings', {templateUrl: 'examples/simple/partials/event-timings.html', controller: 'TimingsCtrl'});

    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);
})(angular);