'use strict';

describe('Inter-section links', function() {

	beforeEach(function() {
		browser().navigateTo('../../examples/simple/index.html'); 
		element('a[href="navbarissue"]').click();
	});

	describe('first, second, first, second - shaking it for issues #42 and #41', function() {
		beforeEach(function() { 
			element('#navbarissue_navart2_link').click();
			element('#navbarissue_navart1_link').click(); 
			element('#navbarissue_navart2_link').click();
		});

		it('should not break horribly', function() {
			expect(element('#navart2').attr('class')).toMatch(/active/);
		});
	});

	describe('first, second - #41 strikes here too', function() {
		beforeEach(function() { 
			element('#navbarissue_navart1_link').click(); 
			element('#navbarissue_navart2_link').click();
		});

		it('should only have 1 title in the header', function() {
			expect(element('#navbarissue header span[class*="title centered"]').count()).toEqual(1);
		});
	});
});