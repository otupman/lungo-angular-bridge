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
  })
  .directive('simpleTap', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var fn = $parse(attr['simpleTap']);
        Lungo.dom(element[0]).tap(function() {
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      }
  }})
;