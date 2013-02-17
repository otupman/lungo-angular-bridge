'use strict';

describe('Angular Lungo Bridge', function() {

	it('Should redirect index.html to index.html', function() {
		browser().navigateTo('../../examples/simple/index.html');
		expect(browser().location().url()).toBe('/');
	});


	describe('Testing routing through angular', function() {

		beforeEach(function() {
			browser().navigateTo('../../examples/simple/index.html');
		});

		it('Should find the cw-view through the browser', function() {
			expect(element('cw-view').count()).toEqual(1);
		});

		it('Navigate to a different static section through the UI', function() {
			element('a[href="section1"]').click();
			expect(browser().location().url()).toBe('/section1');
		});

		it('Navigate to a different dynamic section through the UI', function() {
			element('a[href="dynamic"]').click();
			expect(browser().location().url()).toBe('/dynamic');
			expect(repeater('ul.items li').count()).toBe(3);
		});
	});

});