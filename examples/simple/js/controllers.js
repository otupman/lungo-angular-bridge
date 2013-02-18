'use strict';

function AppCtrl($scope, $location) {
    $scope.name = "Some name";
    /**
	  * A short cut to manually refresh the application from the example/ directory
	  */
    $scope.refreshApplication = function() {
    	window.location = '/examples/simple/index.html';
    }
    AppRouter.instance = AppRouter(Lungo, $location, $scope);
}

function DynamicCtrl($scope) {
	$scope.items = [
    {"name": "Dynamically Loaded",
     "description": "This particular template has been loaded via Angular's dynamic loading."},
    {"name": "Tied with Angular Controllers",
     "description": "The content of this articles are being retrieved from an Angular controller."},
    {"name": "Usage of Ng-Repeater",
     "description": "And repeated through the ng-repeater directive to test it through our End-to-End scenarios."}
  	];
}

angular.module('BridgeExample.controllers', []).
	controller('SearchCtrl', function($scope) {
		$scope.term = $location.search('term');
	})
	.controller('PersonCtrl', function($scope, $routeParams) {
		$scope.personId = $routeParams.personId;
	})
	.controller('DynamicPersonCtrl', function($scope) {
		$scope.personId = "2";
	});