'use strict';


// Declare app level module which depends on filters, and services
angular.module('BridgeExample', ['Centralway.lungo-angular-bridge', 'BridgeExample.filters', 'BridgeExample.services', 'BridgeExample.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/section1', {});
    $routeProvider.when('/dynamic', { templateUrl: 'examples/partials/dynamic.html', controller: DynamicCtrl});
    // $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl});
    // $routeProvider.when('/logout', {templateUrl: 'partials/dashboard.html', controller: LogoutCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);