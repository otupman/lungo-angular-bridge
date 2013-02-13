'use strict';


// Declare app level module which depends on filters, and services
angular.module('TodoExample', 
	['Centralway.lungo-angular-bridge']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/add-todo', {});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }])
	.run(function($rootScope) {
		$rootScope.$on('handleEmit', function(event, args) {
			$rootScope.$broadcast('handleBroadcast', args);
		});
	})
	.directive('formatDate', function() {
		return function(scope, element, attrs) {
			var date = scope.$eval(attrs.ngModel);
			element.text(moment(date).calendar());
		};
	})