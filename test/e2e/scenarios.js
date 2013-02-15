'use strict';

describe('Angular Lungo Bridge', function() {

	it('Should redirect index.html to index.html', function() {
		browser().navigateTo('../../examples/simple/index.html');
		expect(browser().location().url()).toBe('/');
	});

	describe('Showing dynamic cw-view loaded templates', function() {

		beforeEach(function() {
			browser().navigateTo('../../examples/simple/index.html');
			element('a[href="dynamic"]').click();
		});

		it('should display the dynamic page', function() {
			expect(element('section[id="dynamic"]').count()).toEqual(1);
		});

		it('should call section once', function() {
			pause();
			expect(element('#lungo-router-section').text()).toEqual(1); 
		});

	});
   
	describe('Sample Test', function() {

		beforeEach(function() {
			browser().navigateTo('../../examples/simple/index.html');
		});


		it('Should find the cw-view through the browser', function() {
			expect(element('cw-view').count()).toEqual(1);
		});
	});

});