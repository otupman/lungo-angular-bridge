'use strict';

describe('Testing rendering of data-* attributes of directives', function() {    
	describe('on the dynamic page', function() {
		beforeEach(function() {
      browser().navigateTo('../../examples/simple/index.html');
      element('a[href="dynamic"]').click();
      sleep(0.5);
    });
    
    it('should have a directive-and-lungo-test element present', function() {
        expect(element("directive-and-lungo-test").count()).toBe(1);
    });
    
    it('should have the data-icon set to "home"', function() {
        expect(element('directive-and-lungo-test a').attr('data-icon')).toBe('home');
    });
    
    it('should have the data-icon rendered to the DOM', function() {
        expect(element('directive-and-lungo-test a span.icon').attr('class')).toBe('icon home');
    });
	});

  describe('on the first page', function() {
    beforeEach(function() {
        browser().navigateTo('../../examples/simple/index.html');
    });
    
    it('should have a directive-and-lungo-test element present', function() {
        expect(element("directive-and-lungo-test").count()).toBe(1);
    });
    
    it('should have the data-icon set to "home"', function() {
        expect(element('directive-and-lungo-test a').attr('data-icon')).toBe('home');
    });
    
    it('should have the data-icon rendered to the DOM', function() {
        expect(element('directive-and-lungo-test a span.icon').attr('class')).toBe('icon home');
    });
  });
});