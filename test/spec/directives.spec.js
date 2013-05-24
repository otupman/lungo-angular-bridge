'use strict';

describe('directives', function() {
  var domResponse = null;
  beforeEach(function() {
    angular.mock.module('Centralway.lungo-angular-bridge');
    spyOn(Lungo, 'init');
    
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
  
  describe('lab-*quojs touch events*', function() {
    var quoEvents = 'swipe swiping swipeLeft swipeRight swipeDown swipeUp'
    + ' tap hold singleTap doubleTap'
    + ' pinch pinching pinchIn pinchOut'
    + ' rotate rotating rotateLeft rotateRight';
    
    var angularDirectives = {
      'swipeLeft': 'swipe-left', 'swipeRight': 'swipe-right', 'swipeDown': 'swipe-down', 'swipeUp': 'swipe-up'
      , 'singleTap': 'single-tap', 'doubleTap': 'double-tap'
      , 'pinchIn': 'pinch-in', 'pinchOut': 'pinch-out'
      , 'rotateLeft': 'rotate-left', 'rotateRight': 'rotate-right'
    };
    
    angular.forEach(quoEvents.split(' '), function(eventName) {
      it('should register the event handler: ' + eventName, function() {        
        inject(function($compile, $rootScope) {
          var directiveName = 'lab-'+ (angularDirectives[eventName] === undefined ? eventName : angularDirectives[eventName]);
          var element = $compile('<a ' + directiveName + '="eventPerformed()">')($rootScope);
          expect(Lungo.dom).toHaveBeenCalled();
          expect(domResponse.on).toHaveBeenCalled();
          expect(domResponse.on.mostRecentCall.args[0]).toEqual(eventName.toLowerCase());
        });      
      });
    });
  });
  
  describe('Anchor href binding', function() {
    var element = null;
    beforeEach(function() {
      inject(function($compile, $rootScope) {
        element = $compile(
          '<a ng-click="someClick()">Ignore me</a>'
          + '<a href="http://www.google.com">Bindable</a>'
          + '<a href="http://www.somewhere.com" no-href>No bind requested</a>'
          + '<link href="http://www.example.org/style.css">'
        )($rootScope);
      });
    });
    
    xit('should bind a tap handler on anchor tags (and none of the others)', function() { 
      expect(Lungo.dom.calls.length).toBe(1);  
    });
  });
  
  describe('lab-aside', function() {
    
    beforeEach(function() {
     
      
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

describe('directives.popupWindow', function() {
  xit('should be tested', function() {
    expect(false).toBeTruthy();
  })
});