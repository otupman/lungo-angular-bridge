describe('lab-boot', function() {
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
  
  it('should call Lungo init', function() {
    inject(function($compile, $rootScope) {
      var element = $compile('<div lab-boot></div>')($rootScope);
      expect(Lungo.init).toHaveBeenCalled();
      expect(Lungo.init.mostRecentCall.args[0]).toEqual({});
    });
  });

  it('should instantiate the AppRouter', function() {
    AppRouter = jasmine.createSpy('AppRouter');
    inject(function($compile, $rootScope, $location) {
      var element = $compile('<div lab-boot resources="singleFile.html"></div>')($rootScope);
      expect(AppRouter).toHaveBeenCalled();
      expect(AppRouter).toHaveBeenCalledWith(Lungo, $location, $rootScope);
    });

  });

  describe('with parameters', function() {
    it('should pass on a single file correctly', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<div lab-boot resources="singleFile.html"></div>')($rootScope);
        expect(Lungo.init.mostRecentCall.args[0]).toEqual({resources: 'singleFile.html'});
      });
    });

    it('should pass on a file list correctly', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<div lab-boot resources="first.html,second.html"></div>')($rootScope);
        expect(Lungo.init.mostRecentCall.args[0]).toEqual({resources: ['first.html', 'second.html']});
      });
    });
    
    var asidePossibilities = {
      'asideSwiping': true
      , 'asideSwiping="true"': true
      , 'asideSwiping="false"': false
      , '': true
    };
    for(var possibility in asidePossibilities) {
      it('should enable aside swiping', function() {
        inject(function($compile, $rootScope) {
          $compile('<div lab-boot ' + possibility + '></div>')($rootScope);
        });
        
        inject(function(labOptions) {
          expect(labOptions.doAsideSwipe).toBe(asidePossibilities[possibility], 'for aside option ' + possibility);
        });        
      });
    }
  });

});