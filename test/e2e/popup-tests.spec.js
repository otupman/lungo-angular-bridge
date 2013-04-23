'use strict';

describe('Testing popup windows', function() {    
	
    beforeEach(function() {
      browser().navigateTo('../../examples/simple/index.html');
      element('a[href="dynamic"]').click();
      sleep(0.5);
    });

    describe('clicking on the link', function() {
        beforeEach(function() {
            element('#popupLink').click();
            sleep(0.5);
        });
        it('should display the window', function() {
            expect(element('#popup-article').count()).toBe(1);
        });
        
        it('should have the data-icon set to "home"', function() {
            expect(element('#popupDirectiveTest a').attr('data-icon')).toBe('home');
        });
        
        it('should have the data-icon rendered to the DOM', function() {
            expect(element('#popupDirectiveTest a span.icon').attr('class')).toBe('icon home');
        });

        it('should close the window afterwards', function() {
            element('#closeWindowButton').click();
            sleep(0.5);
            expect(element('#poup-article').count()).toBe(0);
        });

        it('should display with a cover', function() {
            // There are two elements with 'cover' - the window itself **and** the section that *was* being displayed
            expect(element('section[data-transition="cover"][ng-include="\'popup-test.html\'"]').count()).toBe(1);
        });

	});

 
});