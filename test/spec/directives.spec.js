'use strict';

function spyOnLungoDom(lng) {
  var domResponse = [''];
  domResponse.each = $$.fn.each;
  domResponse.swiping = jasmine.createSpy('swiping');
  domResponse.swipe = jasmine.createSpy('swipe');
  domResponse.closest = jasmine.createSpy('closest').andCallFake(function() {
    return domResponse;
  });
  domResponse.on = jasmine.createSpy('on');
  domResponse.bind = jasmine.createSpy('bind');
  domResponse.attr = jasmine.createSpy('attr');
  domResponse.__OLDDOM = lng.dom;
  domResponse.restoreOldDom = function() {
    lng.dom = domResponse.__OLDDOM;
  };
  spyOn(Lungo, 'dom').andCallFake(function(selector) {
    return domResponse;
  });
  
  return domResponse;
}

describe('directives', function() {
  var domResponse = null;
  beforeEach(function() {
    angular.mock.module('Centralway.lungo-angular-bridge');
    spyOn(Lungo, 'init');
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
    
    var oldDom = Lungo.dom,
        domResponse;
    
    beforeEach(function() {
      
      
      domResponse = spyOnLungoDom(Lungo);
    });
    
    afterEach(function() {
      domResponse.restoreOldDom();
    });
        
    angular.forEach(quoEvents.split(' '), function(eventName) {
      it('should register the event handler: ' + eventName, function() {
        inject(function($compile, $rootScope) {
          var directiveName = 'lab-'+ (angularDirectives[eventName] === undefined ? eventName : angularDirectives[eventName]);
          var element = $compile('<a ' + directiveName + '="eventPerformed()">')($rootScope);
          expect(Lungo.dom).toHaveBeenCalled();
          expect(domResponse.on).toHaveBeenCalled();
          expect(domResponse.on.mostRecentCall.args[0]).toEqual(eventName);
        });
      });
    });
  });

  describe('Anchor href binding', function() {
    var element = null;
    var wasClicked = false;
    beforeEach(function() {
      spyOn(Lungo, 'dom').andCallThrough();
      
      inject(function($compile, $rootScope, $location) {
        $rootScope.clicked = function() {
          wasClicked = true;
        };
        element = $compile(
          '<div><a ng-click="someClick()">Ignore me</a>'
          + '<a href="#/test" class="bindable" ng-click="clicked()">Bindable</a>'
          + '<a href="http://www.somewhere.com" no-href>No bind requested</a>'
          + '<link href="http://www.example.org/style.css"></div>'
        )($rootScope);
      });
    });
    
    it('should triggerd a click', function() {
      $$(element[0]).find('a.bindable').trigger('tap');
      //! Would prefer to check location to ensure that the browser has followed the link
      //! however FF handles the iframe differently so there's no change to it's location :(
      //! so we check simply to make sure that the tap fires a click
      expect(wasClicked).toBeTruthy();
    });
    it('should bind a tap handler on anchor tags (and none of the others)', function() { 
      expect(Lungo.dom.calls.length).toBe(1);
    });
  });
});

describe('directives.popupWindow', function() {
  xit('should be tested', function() {
    expect(false).toBeTruthy();
  })
});
