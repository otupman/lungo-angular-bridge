describe('Fast back', function() {

  beforeEach(function() {
    browser().navigateTo('../test/cases/fast-back-test.html#/screen1');
  });


  describe('Going back 3 times realy fast', function() {
    beforeEach(function() {
      element('#go-to-screen-2').click();
      element('#go-to-screen-3').click();
      element('#go-to-screen-4').click();
    });

    it('should be on screen 3', function() {
      //let's go back reeeealy fast
      element('#screen4 nav.left a').click();
      element('#screen3 nav.left a').click();
      element('#screen2 nav.left a').click();

      //opening pandora box (aside)
      element('#screen1 nav.left a').click();

      expect(element('#screen1[data-transition="null"]').count()).toBe(0);
    });
  });
});