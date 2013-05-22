(function(controllers) {
  'use strict';

  function toggleRightAside() {
    Lungo.View.Aside.toggle('#rightaside');
  }

  controllers.controller('AppCtrl', ['$scope', function AppCtrl($scope) {
      $scope.name = "Some name";
      /**
  	  * A short cut to manually refresh the application from the example/ directory
  	  */
      $scope.refreshApplication = function() {
      	window.location = '/examples/simple/index.html';
      }
      console.log('AppCtrl::AppCtrl() - Instantiated');
      
      $scope.triggerAside = function() {
          console.log('triggering aside');
          Lungo.Router.aside('main', 'aside1');
      }

      $scope.triggerRightAside = toggleRightAside;
  }]);

  controllers.controller('AsideCtrl', ['$scope', function AsideCtrl($scope) {
    $scope.firstName = "Bob";
    $scope.counter = 1;

    $scope.changeName = function() {
      $scope.firstName = $scope.firstName + ' ' + $scope.counter;
      $scope.counter++;
    }
  }]);

  controllers.controller('TopLevelCtrl', ['$scope', function TopLevelCtrl($scope) {
    $scope.callTopLevel = function() {
      alert('Top level called!');
    }
  }]);

  controllers.controller('DynamicCtrl', ['$scope', 'popupService', function DynamicCtrl($scope, popupService) {
  	$scope.items = [
      {"name": "Dynamically Loaded",
       "description": "This particular template has been loaded via Angular's dynamic loading."},
      {"name": "Tied with Angular Controllers",
       "description": "The content of this articles are being retrieved from an Angular controller."},
      {"name": "Usage of Ng-Repeater",
       "description": "And repeated through the ng-repeater directive to test it through our End-to-End scenarios."}
    	];

    $scope.triggerRightAside = toggleRightAside;

      $scope.closeWindow = function() {
        popupService.close();
      }
  }]);

  controllers.controller('TimingsCtrl', ['$scope', function TimingsCtrl($scope) {
    $scope.messages = [];
    var startTime = Date.now();
    var _logTime = function(message) {
      $scope.messages.push((Date.now() - startTime) + ':' + message);
      console.log($scope.messages[$scope.messages.length-1]);
    }  
    
    $scope.clearMessages = function() {
      $scope.messages.length = 0;
    };  
    
    $scope.tapped = function(event) {
      $scope.startTime = Date.now();
      _logTime('tapped');
    }
    
    $scope.labTapped = function(message) {
      _logTime('lab tapped - ' + message);
    };
    
    $scope.submitted = function() {
      _logTime('submitted');
    };
    
  }]);

  controllers
  	.controller('SearchCtrl', ['$scope', '$location', function($scope, $location) {
  		$scope.term = $location.search('term');
  	}])
  	.controller('PersonCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  		$scope.personId = $routeParams.personId;
  	}])
  	.controller('DynamicPersonCtrl', ['$scope', function($scope) {
  		$scope.personId = "2";
  	}]);
})(angular.module('BridgeExample.controllers', ['Centralway.lungo-angular-bridge']));