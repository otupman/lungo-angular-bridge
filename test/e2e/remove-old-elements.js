describe('Remove old Elements', function() {
  var WAIT_TIME = 0.35; // The example uses a special version of the Lungo CSS that delays transitions by 3.5s

  beforeEach(function() {
    browser().navigateTo('../test/cases/transition-tests.html');
  });


  describe('Removing old elements: main -> first -> second -> third', function() {
    beforeEach(function() {
      element('a[href="#/screen1"]').click();
      sleep(WAIT_TIME);
      element('a[href="#/screen2"]').click();
      sleep(WAIT_TIME);
      element('a[href="#/screen3"]').click();
      sleep(WAIT_TIME);
    });

    it('should be on screen 3', function() {
      expect(element('#screen3:visible').count()).toBe(1);
    });

    it('should only have 1 archived element', function() {
      expect(element('section[class*="lab-old-view"]').count()).toBe(1);
    });

  });


});