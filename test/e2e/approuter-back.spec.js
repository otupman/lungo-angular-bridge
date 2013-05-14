'use strict';

describe('Testing manual back', function() {

  beforeEach(function() {
    browser().navigateTo('../test/cases/fast-back-test.html#/screen1');
  });

  describe('Forward, forward, back, back', function() {
    beforeEach(function() {
      element('#go-to-screen-2').click();
      element('#go-to-screen-3').click();
      element('#go-to-screen-4').click();
      element('#screen4 nav.left a').click();
      element('#screen3 nav.left a').click();
    });
    
    it('should have gone back twice', function() {
      expect(browser().location().path()).toEqual('/screen2');
    });
  });
  
});