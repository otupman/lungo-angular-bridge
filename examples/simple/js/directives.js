'use strict';

/* Directives */

angular.module('BridgeExample.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('wrapLungo', function() {
  	return {
  		restrict: 'A'
  		, priority: 0
  		, transclude: true
  		, link: function(scope, iElement, iAttrs, controller) {
  			console.log(iElement);
  		}
  	}
  })
  .directive('compileLungo', function() {
  	return {
  		restrict: 'A'
  		, compile: function compile(tElement, tAttrs, transclude) {
  			console.log(transclude);
	      return {
	        pre: function preLink(scope, iElement, iAttrs, controller) { 
	        	console.log('compile prelink: ');
	        	console.log(iElement);
	        },
	        post: function postLink(scope, iElement, iAttrs, controller) {
	        	console.log('compile postlink: ');
	        	console.log(iElement);
	        	Lungo.Boot.Data.init(iElement[0]);
	        }
	      }
	    }
  	}
  })
  .directive('directiveAndLungoTest', function() {
  	return {
            restrict: 'E'
            , template: '<a wrap-lungo compile-lungo data-icon="home">Has home icon?</a>'
            , link: function(scope, iElement, iAttrs, controller) {
            	console.log(iElement);
            }
        }
  });