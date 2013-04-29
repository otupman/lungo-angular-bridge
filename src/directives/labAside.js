angular.module('Centralway.lungo-angular-bridge')
  .directive('labAside', function() {
    var subscribeEvents = function(hrefs) { //STOLEN: from Lungo
      var CLASS = {
        SHOW: Lungo.Constants.CLASS.SHOW
      };
      var show = Lungo.View.Aside.show;
      var hide = Lungo.View.Aside.hide;
      // The following probably sets the minimum distance the user's finger must swipe before the triggering of the aside kicks in
      var MIN_XDIFF = parseInt(document.body.getBoundingClientRect().width / 3, 10);
      hrefs.each(function() {
        var STARTED = false;
        var a = Lungo.dom(this);
        var section = a.closest("section");
        var aside = Lungo.dom('#' + a.attr("lab-aside"));
        
        section.swiping(function(gesture) {
          if(!section.hasClass("aside")) {
            var xdiff =  gesture.currentTouch.x - gesture.iniTouch.x;
            var ydiff =  Math.abs(gesture.currentTouch.y - gesture.iniTouch.y);
            
            STARTED = STARTED ? true : xdiff > 3*ydiff && xdiff < 50;
            
            if(STARTED) {
              xdiff = xdiff > 256 ? 256 : xdiff < 0 ? 0 : xdiff;
              aside.addClass(CLASS.SHOW);
              section.vendor('transform', 'translateX(' + xdiff + 'px)');
              section.vendor('transition-duration', '0s');
            } else {
              section.attr('style', '');
            }
          }
        });
        
        section.swipe(function(gesture) {
          var diff = gesture.currentTouch.x - gesture.iniTouch.x;
          var ydiff =  Math.abs(gesture.currentTouch.y - gesture.iniTouch.y);
          section.attr('style', '');
          if(diff > MIN_XDIFF && STARTED) {
            show(aside);
          }
          else {
            hide(aside);
          }
          STARTED = false;
        });
      });
    };
    
    return {
      restrict: 'A'
      , link: function(scope, element, attr) {
        var asideId = element.attr('lab-aside');
        element.bind('click', function() {
          Lungo.View.Aside.toggle('#' + asideId);
        });
        subscribeEvents(Lungo.dom(element[0]));
      }
    }  
});
