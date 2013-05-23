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
  
  it('should intercept hrefs', function() { 
    labElem('#screen2Link').tap();
    expect(element('#screen2:visible').count()).toBe(1);
    expect(element('#screen2 strong').text()).toEqual('Screen 2');
  });
  
  it('should work with more complicated selectors', function() {
    labElem('#first_article button[id="tapButton"]').tap();
    expect(element('#lastEvent').text()).toEqual('tapped');
  });

});