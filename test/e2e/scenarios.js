'use strict';

describe('Angular Lungo Bridge', function() {

	it('Should redirect index.html to index.html', function() {
		browser().navigateTo('../../examples/simple/index.html');
		expect(browser().location().url()).toBe('/');
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