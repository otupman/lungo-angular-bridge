'use strict';

/* Directives */

angular.module('BridgeExample.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('directiveAndLungoTest', function() {
  	return {
            restrict: 'E',
            template: '<a data-icon="home">Has home icon?</a>'

        }
  });