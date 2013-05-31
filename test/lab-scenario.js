
(function(angular) {
  function mouseEvent(type, sx, sy, cx, cy) {
  
    var evt;
  
    var e = {
      bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
      screenX: sx, screenY: sy, clientX: cx, clientY: cy,
      ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
      button: 0, relatedTarget: undefined
    };
  
    if (typeof( document.createEvent ) == "function") {
      evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
      e.screenX, e.screenY, e.clientX, e.clientY,
      e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
      e.button, document.body.parentNode);
    } else if (document.createEventObject) {
  
      evt = document.createEventObject();
      for (prop in e) {
        evt[prop] = e[prop];
      }
      evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
    }
    return evt;
  }
  
  function dispatchEvent (el, evt) {
    if (el.dispatchEvent) {
      el.dispatchEvent(evt);
    } else if (el.fireEvent) {
      el.fireEvent('on' + type, evt);
    }
    return evt;
  }  
  
  //TODO: Add more mobile-specific stuff? Such as geo, tilting, etc.
  
  angular.scenario.dsl('labElem', function() {
    var fireEvent = function(elem, eventName) {
      var evt = mouseEvent(eventName, 1, 5000, 1, 5000);
  
      if(elem.length === 0) {
        done('Could not find element ' + selector);
      }
      dispatchEvent(elem[0], evt);
    };    
    
    var chain = {};
     
    var quoEvents = 'swipe swiping swipeLeft swipeRight swipeDown swipeUp'
      + ' tap hold singleTap doubleTap'
      + ' pinch pinching pinchIn pinchOut'
      + ' rotate rotating rotateLeft rotateRight';
    
    angular.forEach(quoEvents.split(' '), function(eventName) {
      chain[eventName] = function() {
        var futureLabel = "element '" + this.label + "' " + eventName;
        return this.addFutureAction(futureLabel, function($window, $document, done) {
            var elements = $document.elements();
            var href = elements.attr('href');
            var eventProcessDefault = fireEvent(elements, eventName);
            done();
          });
      };    
    });
    
    return function(selector, label) {
      this.dsl.using(selector, label);
      return chain;
    };
  });
})(angular);