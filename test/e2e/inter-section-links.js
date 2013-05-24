'use strict';

describe('Inter-section links', function() {

	beforeEach(function() {
      browser().navigateTo('../../examples/simple/index.html'); 
      labElem('a[href="navbarissue"]').tap();
	});

	describe('first, second, first, second - shaking it for issues #42 and #41', function() {
		beforeEach(function() { 
			labElem('#navbarissue_navart2_link').tap();
			labElem('#navbarissue_navart1_link').tap(); 
			labElem('#navbarissue_navart2_link').tap();
		});

		it('should not break horribly', function() {
			expect(element('#navart2').attr('class')).toMatch(/active/);
		});

		describe("when clicking on the current page's link", function() {
			beforeEach(function() {
				labElem('#navbarissue_navart2_link').tap();
			});

			it('should continue to display the current', function() {
				expect(element('#navart2').attr('class')).toMatch(/active/);	
			})

			it('should display the navart2 article', function() {
				expect(element('#navart2:visible').count()).toBe(1);
			});
			
		});
	});

	describe('first, second - #41 strikes here too', function() {
		beforeEach(function() { 
			labElem('#navbarissue_navart1_link').tap(); 
			labElem('#navbarissue_navart2_link').tap();
		});

		it('should only have 1 title in the header', function() {
			expect(element('#navbarissue header span[class*="title centered"]').count()).toEqual(1);
		});
	});
});