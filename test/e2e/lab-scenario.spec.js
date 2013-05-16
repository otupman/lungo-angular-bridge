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

});