describe('Lab Scenario Tests', function() {

  beforeEach(function() {
    browser().navigateTo('../test/cases/lab-scenario-tests.html');
  });

  it('should simulate tap events', function() {
    labElem('#tapButton').tap();
    expect(element('#lastEvent').text()).toEqual('tapped');
  });
  
  it('should simulate swipe events', function() {
    labElem('#swipeButton').swipe();
    expect(element('#lastEvent').text()).toEqual('swiped');
  });

  it('should move to the next screen', function() {
    labElem('a.go-to-screen2').tap();
    expect(element('#screen2:visible').count()).toBe(1);
  });

  it('should show the aside', function() {
    labElem('a.test.aside').tap();
    expect(element('#leftAside:visible').count()).toBe(1);
  });

});