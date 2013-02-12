'use strict';

function AppCtrl($scope, $location) {
    $scope.name = "Some name";
    AppRouter.instance = AppRouter(Lungo, $location, $scope);
}

function DynamicCtrl($scope) {
	
}