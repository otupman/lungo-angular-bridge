'use strict';

describe('Testing manual back', function() {

  beforeEach(function() {
    browser().navigateTo('../test/cases/app-router-back-test.html#/screen1');
  });

  describe('Forward, forward, back, back', function() {
    
    it('using sections should have gone back twice', function() {
      element('#go-to-screen-2').click();
      element('#go-to-screen-3').click();
      element('#go-to-screen-4').click();
      element('#screen4 nav.left a').click();
      element('#screen3 nav.left a').click();
      expect(browser().location().path()).toEqual('/screen2');
    });
    
    it('using sections AND articles it should have gone back twice', function() {
      element('#go-to-screen-2-article').click();
      element('#go-to-screen-3-article').click();
      element('#go-to-screen-4-article').click();
      element('#screen4 nav.left a').click();
      element('#screen3 nav.left a').click();
      expect(browser().location().path()).toEqual('/screen2/article2');
    });
    
    it('using sections, articles AND an ID should have gone back twice', function() {
      element('#go-to-screen-2-article-id').click();
      element('#go-to-screen-3-article-id').click();
      element('#go-to-screen-4-article-id').click();
      element('#screen4 nav.left a').click();
      element('#screen3 nav.left a').click();
      expect(browser().location().path()).toEqual('/screen2/article2/123');
    });
    
  });
  
  
});