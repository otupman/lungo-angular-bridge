describe('Fast back', function() {

  beforeEach(function() {
    browser().navigateTo('../test/cases/fast-back-test.html#/screen1');
  });


  describe('Going back 3 times realy fast', function() {
    beforeEach(function() {
      labElem('#go-to-screen-2').tap();
      labElem('#go-to-screen-3').tap();
      labElem('#go-to-screen-4').tap();
    });

    it('should be on screen 3', function() {
      //let's go back reeeealy fast
      labElem('#screen4 nav.left a').tap();
      labElem('#screen3 nav.left a').tap();
      labElem('#screen2 nav.left a').tap();

      //opening pandora box (aside)
      labElem('#screen1 nav.left a').tap();

      expect(element('#screen1[data-transition="null"]').count()).toBe(0);
    });
  });
});