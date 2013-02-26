'use strict';

angular.scenario.dsl('xPosition', function() {
	var TRANSFORM_XPOS = 4;
	return function(selector) {
		return this.addFutureAction('xPosition', function(window, $document, done) {
			var transform = $document.find(selector).css('-webkit-transform');
			if(!transform) {
				var reason = ($document.find(selector).length == 0) ? ' because there are no selector matches' : '';
				done('Selector ' + selector + ' got no -webkit-transform value. ' + reason);
				return;
			}
			var splitTransform = transform.split(',');
			done(null, parseInt(splitTransform[TRANSFORM_XPOS]));
		});
	};
});

describe('Transitions', function() {
	var WAIT_TIME = 0.35; // The example uses a special version of the Lungo CSS that delays transitions by 3.5s

	beforeEach(function() {
		browser().navigateTo('../test/cases/transition-tests.html'); 
	});

	describe('Backward', function() {
		beforeEach(function() {
			element('a[href="#/screen1"]').click();
			sleep(WAIT_TIME);
			element('a[href="#/screen2"]').click();
			sleep(WAIT_TIME);
		});

		it('should bring screen 1 from the left', function() {
			element('a[href="#/screen1"]').click();
			expect(xPosition('#screen1')).toBeLessThan(0);
		});
	});

	describe('Forwards', function() {
		beforeEach(function() {
			element('a[href="#/screen1"]').click();
			sleep(WAIT_TIME);
		});

		it('should animate forwards when moving forwards', function() {
			element('a[href="#/screen2"]').click();
			sleep(WAIT_TIME); 	
			expect(xPosition('#screen2')).toBe(0);
		});

		describe('from second to third screen', function() {
			beforeEach(function() {
				element('a[href="#/screen2"]').click();
				sleep(WAIT_TIME);
				element('a[href="#/screen3"]').click();
			});

			it('should not still have screen 2 in the DOM', function() {
				sleep(WAIT_TIME);
				expect(element('#screen2').count()).toBe(0);
			});

			it('should not have screen 1 in the DOM', function() {
				expect(element('#screen1').count()).toBe(0);
			});

			it('should transition screen THREE from the right', function() {
				expect(xPosition('#screen3')).toBeGreaterThan(0);
				sleep(WAIT_TIME);
				expect(xPosition('#screen3')).toBe(0);
			});
		});
	});

	describe('Simple transitions: main -> first -> second -> third', function() {
		beforeEach(function() { 
			element('a[href="#/screen1"]').click();	
			sleep(WAIT_TIME);
			element('a[href="#/screen2"]').click();	
			sleep(WAIT_TIME);
			element('a[href="#/screen3"]').click();	
			sleep(WAIT_TIME);
		});

		it('should be on screen 3', function() {
			expect(element('#screen3:visible').count()).toBe(1);
		});

		it('should have no other visible screens', function() {

			expect(element('#screen1:visible').count()).toBe(0);
			expect(element('#screen2:visible').count()).toBe(0);
		});

		it('should have removed the very first screen', function() {
			expect(element('#screen1').count()).toBe(0);
		});

	});

});