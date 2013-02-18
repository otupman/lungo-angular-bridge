'use strict';


// Declare app level module which depends on filters, and services
angular.module('photoMapApp', 
	['Centralway.lungo-angular-bridge']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/camera', {templateUrl: "partials/camera.html", controller: "PhotoCtrl"});
    $routeProvider.when('/map', {templateUrl: "partials/map.html", controller: "MapCtrl"});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(false);
  }]);  
