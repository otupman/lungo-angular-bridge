'use strict';

function AppCtrl($scope, $location) {
    $scope.name = "Some name";
    /**
	  * A short cut to manually refresh the application from the example/ directory
	  */
    $scope.refreshApplication = function() {
    	window.location = '/examples/index.html';
    }
    AppRouter.instance = AppRouter(Lungo, $location, $scope);
}

function DynamicCtrl($scope) {
	
}