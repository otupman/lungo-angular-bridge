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
	
}

angular.module('BridgeExample.controllers', []).
	controller('SearchCtrl', function($scope) {
		$scope.term = $location.search('term');
	})
	.controller('PersonCtrl', function($scope, $routeParams) {
		$scope.personId = $routeParams.personId;
	});