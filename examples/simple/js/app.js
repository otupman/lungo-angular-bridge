'use strict';


// Declare app level module which depends on filters, and services
angular.module('BridgeExample', 
	['Centralway.lungo-angular-bridge'
	, 'BridgeExample.filters', 'BridgeExample.services', 'BridgeExample.directives', 'BridgeExample.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // First section is embedded in index.html, so no parameters
    $routeProvider.when('/section1', {});
    // Dynamic section is loaded via cw-view
    $routeProvider.when('/dynamic', { templateUrl: 'examples/partials/dynamic.html', controller: DynamicCtrl});
    // Demo of using query parameters for search terms
    $routeProvider.when('/search', { templateUrl: 'examples/partials/search.html', controller: 'SearchCtrl'});
    // Demo of using IDs within URLs - note the section ID then article ID and **then** the person ID
    $routeProvider.when('/person/view/:personId', { templateUrl: '/examples/partials/person.html', controller: 'PersonCtrl'});

    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);