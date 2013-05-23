'use strict';

describe('Angular Lungo Bridge Simple App E2E Tests', function() {

	it('Should redirect index.html to index.html', function() {
		browser().navigateTo('../../examples/simple/index.html');
		expect(browser().location().url()).toBe('/');
	});


	describe('Testing routing through angular', function() {

		beforeEach(function() {
			browser().navigateTo('../../examples/simple/index.html');
		});

		it('Should find the lab-view through the browser', function() {
			expect(element('lab-view').count()).toEqual(1);
		});

		it('Should render a static section using the UI', function() {
			labElem('a[href="section1"]').tap();
			expect(browser().location().url()).toBe('/section1');
		});

		it('Should render a dynamic section through the UI', function() {
			labElem('a[href="dynamic"]').tap();
			expect(browser().location().url()).toBe('/dynamic');
			expect(repeater('ul.items li').count()).toBe(3);
		});

		it('Should render the page previously loaded', function() {
			labElem('a[href="dynamic"]').tap();
			expect(browser().location().url()).toBe('/dynamic');
			labElem('a[href="/"]').tap();
			expect(element('header').attr('data-title')).toBe("Simple Application");
		});

		it('Should render person specific id in the view', function() {
			labElem('a[href="person/view/2"]').tap();
			expect(browser().location().url()).toBe('/person/view/2');
			expect(element('span.id').text()).toBe("2");
		})
	});
});