'use strict';

describe('Testing manual back', function() {

  beforeEach(function() {
    browser().navigateTo('../test/cases/app-router-back-test.html#/screen1');
  });

  describe('Forward, forward, back, back', function() {
    
    it('using sections should have gone back twice', function() {
      labElem('#go-to-screen-2').tap();
      labElem('#go-to-screen-3').tap();
      labElem('#go-to-screen-4').tap();
      labElem('#screen4 nav.left a').tap();
      labElem('#screen3 nav.left a').tap();
      expect(browser().location().path()).toEqual('/screen2');
    });
    
    it('using sections AND articles it should have gone back twice', function() {
      labElem('#go-to-screen-2-article').tap();
      labElem('#go-to-screen-3-article').tap();
      labElem('#go-to-screen-4-article').tap();
      labElem('#screen4 nav.left a').tap();
      labElem('#screen3 nav.left a').tap();
      expect(browser().location().path()).toEqual('/screen2/article2');
    });
    
    it('using sections, articles AND an ID should have gone back twice', function() {
      labElem('#go-to-screen-2-article-id').tap();
      labElem('#go-to-screen-3-article-id').tap();
      labElem('#go-to-screen-4-article-id').tap();
      labElem('#screen4 nav.left a').tap();
      labElem('#screen3 nav.left a').tap();
      expect(browser().location().path()).toEqual('/screen2/article2/123');
    });
    
  });
  
  
});