'use strict';

describe('directives', function() {
  beforeEach(function() {
    angular.mock.module('Centralway.lungo-angular-bridge');
    spyOn(Lungo, 'init');
  });
  
  describe('lab-aside', function() {
    var domResponse = null;
    
    beforeEach(function() {
      domResponse = [''];
      domResponse.each = $$.fn.each;
      domResponse.swiping = jasmine.createSpy('swiping');
      domResponse.swipe = jasmine.createSpy('swipe');
      domResponse.closest = jasmine.createSpy('closest').andCallFake(function() {
        return domResponse;
      });
      domResponse.attr = jasmine.createSpy('attr');
      
      spyOn(Lungo, 'dom').andCallFake(function(selector) {
        return domResponse;
      });
      
      inject(function($compile, $rootScope) {
        var element = $compile(
         '<aside id="testAside"></aside>'
        +'<section><header>'
        +'<nav><a lab-aside="testAside">Test aside</a></nav>'
        +'</header><article class="active"></article></section>'
        )($rootScope);
      });
    });
    
    it('should have registered the swiping handlers', function() {
      expect(domResponse.swiping).toHaveBeenCalled();
      expect(domResponse.swipe).toHaveBeenCalled();
    });
  });
  
  describe('lab-boot', function() {
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

    describe('with resources', function() {
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
    });
  
  });

});