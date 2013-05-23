'use strict';

describe('Aside tests', function() {
	var ASIDE_WAIT = 0.5;

	beforeEach(function() {
		browser().navigateTo('../../examples/simple/index.html');
		sleep(1);
	});


	describe('Aside across sections', function() {

		beforeEach(function() {
			labElem('#triggerLeftAsideLink').tap();
			sleep(ASIDE_WAIT);
			labElem('#aside1_dynamic').tap();
			sleep(ASIDE_WAIT);			
		})

		it('should hide when navigating to a new section', function() {
			expect(element('#aside1:visible', 'Lefthand aside').count()).toBe(0);
		});

		it('should hide the previous section', function() {
			expect(element('#main[class*="aside"]').count()).toBe(0);
		});
	});

	describe('Basic aside operations', function() {
		it('should initially be hidden', function() {
			expect(element('#aside1:visible').count()).toBe(0);
		});

		it('should display the aside', function() {
			labElem('#triggerLeftAsideLink').tap();
			sleep(ASIDE_WAIT);

			expect(element('#aside1:visible').count()).toBe(1);
		});

		it('should hide a previously-displayed aside', function() {
			labElem('#triggerLeftAsideLink').tap();
			sleep(ASIDE_WAIT);

			labElem('#triggerLeftAsideLink').tap();
			sleep(ASIDE_WAIT);

			expect(element('#aside1:visible').count()).toBe(0);
		});
	});



});