'use strict';


// Declare app level module which depends on filters, and services
angular.module('photoMapApp', 
	['Centralway.lungo-angular-bridge']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/camera', {templateUrl: "partials/camera.html"});
    $routeProvider.when('/map', {templateUrl: "partials/map.html"});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(false);
  }])
	.run(function($rootScope) {
		$rootScope.$on('handleEmit', function(event, args) {
			$rootScope.$broadcast('handleBroadcast', args);
		});
	});  
