describe('lab-aside', function() {
  
  var lab = null;
  
  beforeEach(function() {
    angular.mock.module('Centralway.lungo-angular-bridge');
    lab = angular.module('Centralway.lungo-angular-bridge');
    spyOn(Lungo, 'init');
    //TODO(otupman) - merge these using the forthcoming spyOnLungoDom function
    domResponse = [''];
    domResponse.each = $$.fn.each;
    domResponse.swiping = jasmine.createSpy('swiping');
    domResponse.swipe = jasmine.createSpy('swipe');
    domResponse.closest = jasmine.createSpy('closest').andCallFake(function() {
      return domResponse;
    });
    domResponse.on = jasmine.createSpy('on');
    domResponse.bind = jasmine.createSpy('bind');
    domResponse.attr = jasmine.createSpy('attr');
    
    spyOn(Lungo, 'dom').andCallFake(function(selector) {
      return domResponse;
    });
  });
  
  describe('with default options', function() {
    
    it('should have registered the swiping handlers', inject(function($compile, $rootScope, labOptions) {
      labOptions.doAsideSwipe = true; //TODO(otupman) work out how to use lab-boot to intialise this
      var element = $compile(
       '<aside id="testAside"></aside>'
      +'<section><header>'
      +'<nav><a lab-aside="testAside">Test aside</a></nav>'
      +'</header><article class="active"></article></section>'
      )($rootScope);
      expect(domResponse.swiping).toHaveBeenCalled();
      expect(domResponse.swipe).toHaveBeenCalled();
    }));
  });
  
  describe('with non-default options', function() {
    var asideTemplate = '<aside id="testAside"></aside>'
      +'<section><header>'
      +'<nav><a lab-aside="testAside" no-swipe="true">Test aside</a></nav>'
      +'</header><article class="active"></article></section>';
    
    it('and swipe off should NOT have registered the swiping handlers',   inject(function($compile, $rootScope) {
      //TODO(otupman) - these work by chance :(
      var element = $compile(asideTemplate)($rootScope);
      expect(domResponse.swiping).not.toHaveBeenCalled();
      expect(domResponse.swipe).not.toHaveBeenCalled();
    }));
    
    it('should turn swipe off from the lab options', inject(function($compile, $rootScope) {
      $compile('<div lab-boot aside-swiping="false">' + asideTemplate + '</div>');
      expect(domResponse.swiping).not.toHaveBeenCalled();
      expect(domResponse.swipe).not.toHaveBeenCalled();
      
    }));
  });
});