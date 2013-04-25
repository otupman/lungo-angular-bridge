'use strict';

var AppRouter = function(Lungo, $location, $scope) {
  var routingHistory = [];

  var oldReplace = $location.replace;

  var _SECTION_PATH_LENGTH = 2;
  var _SECTION_INDEX = 1;
  var _ARTICLE_INDEX = 2;

  var _CONTENT_REMOVAL_TIMEOUTMS = 500;

  $location.replace = function() {
    $location.$$replace = true;
    return $location;
  }

  var _hasArticle = function(path) {
    var splitPath = angular.isArray(path) ? path : path.split('/');
    return splitPath.length > _SECTION_PATH_LENGTH;
  }

  var _assertElementExists = function(id) {
    if(id.indexOf('#') == -1) {
      id = '#' + id;
    }
    if(Lungo.dom(id).length == 0) {
      throw new Error('No such element with ID [' + id + ']');
    }
  }

  var showSection = function(path) {
    var pathParts = path.split('/');
    var sectionName = pathParts[_SECTION_INDEX] !== '' ? pathParts[_SECTION_INDEX] : 'main';
    _assertElementExists(sectionName);
    if(pathParts.length > _SECTION_PATH_LENGTH) {
      _assertElementExists(pathParts[_ARTICLE_INDEX]);
      Lungo.Router.article(sectionName, pathParts[_ARTICLE_INDEX]);
    }
    else {
      Lungo.Router.section(sectionName);
    }
  };

  var _isSameSection = function(path) {
    if(routingHistory.length == 0) {
      return false;
    }
    var currentPathParts = routingHistory[routingHistory.length-1].split('/');
    var pathParts = path.split('/');
    return currentPathParts[_SECTION_INDEX] === pathParts[_SECTION_INDEX];
  }

  var _resetAsideStates = function() {
    var openAsides = Lungo.dom('aside[class*="show"]');
    angular.forEach(openAsides, function(value) {
      Lungo.View.Aside.toggle('#' + Lungo.dom(value).attr('id'));
    });
    Lungo.dom('section[class*="aside"]').removeClass('aside');
  }

  var _isBack = function($location) {
    return routingHistory.length > 0 && routingHistory[routingHistory.length-2] == $location.path() && !_hasArticle($location.path());
  }

  var isBack = function() {
    return _isBack($location);
  }
  $scope.$on('$routeChangeSuccess', function(next, last) {
    _resetAsideStates();
    if(_isBack($location)) {
      routingHistory.pop();
      try {
        Lungo.Router.back();
      } catch(e) {
        console.log('AppRouter::$routeChangeSuccess - caught exception while navigating back to ', $location.path(), ' : ', e);
        throw e;
      }
    }
    else {

      showSection($location.path());
      if(!_isSameSection($location.path())) {
        routingHistory.push($location.path());
      }
    }
  });

  var getPrevious = function() {
    if(routingHistory.length < 2) {
      throw new Error('No back to go back to!');
    }
    return routingHistory[routingHistory.length - 2];
  }

  var back = function() {

    if(routingHistory.length == 0) {
      return;
    }
    var previousLocation = getPrevious();
    $location.path(previousLocation);
  }

  return {
    back: back
    , isBack: isBack
    , isSameSection: _isSameSection
  }

};

angular.module('Centralway.lungo-angular-bridge', [])
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
  })
	.directive('labBoot', ['$location', function($location) {
    function _parseResourceParam(param) {
      return param.indexOf(',') == -1 ? param : param.split(',');
    }
    return function(scope, elm, attrs) {
      Lungo.init({
        'resources': elm.attr('resources') && _parseResourceParam(elm.attr('resources'))
      });
      AppRouter.instance = AppRouter(Lungo, $location, scope);
    };
  }])
	.directive('labView', ['$http', '$templateCache', '$route', '$anchorScroll', '$compile', '$controller', '$location', function($http, $templateCache, $route, $anchorScroll, $compile, $controller, $location) {
  return {
    restrict: 'ECA',
    terminal: true,
    link: function(scope, element, attr) {
      var lastScope,
          onloadExp = attr.onload || '';

      scope.$on('$routeChangeSuccess', update);
      update();


      function destroyLastScope() {
        if (lastScope) {
          lastScope.$destroy();
          lastScope = null;
        }
      }

      function retrieveCurrentLabView() {
        return Lungo.dom('*[class*="lab-view"]');
      }

      function _archiveOldContent(currentLabView) {
         var oldElement = Lungo.dom('*[class*="lab-old-view"]')
         if (oldElement.length > 0) {
          oldElement.remove();
         }

         currentLabView.removeClass('lab-view').addClass('lab-old-view');

          if(currentLabView.length > 0) {
            currentLabView
              .attr('lab-view-old-id', currentLabView.attr('id'))
              .removeAttr('id');
          }
      }

      function update() {
        var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;

        if (template && !AppRouter.instance.isSameSection($location.path())) {

          scope.$emit('$labViewUpdateStart', null);
          var targetContainer = element.parent();
          var currentLabView = retrieveCurrentLabView();

          _archiveOldContent(currentLabView);

          var newElement = null;

          targetContainer.append(template);

          newElement = angular.element(targetContainer.children()[targetContainer.children().length - 1]);
          newElement.addClass('lab-view');

          if(!newElement.attr('id')){
            throw new Error('Elements loaded via templates must have an ID attribute');
          }

          if(AppRouter.instance.isBack($location)) {
            var currentLabViewTransition = currentLabView.data('transition');
            newElement.attr('data-transition-origin', currentLabViewTransition);

            newElement.addClass('hide');
          }

          Lungo.Boot.Data.init('#' + newElement.attr('id'));

          destroyLastScope();

          var link = $compile(newElement.contents()),
              current = $route.current,
              controller;

          lastScope = current.scope = scope.$new();
          if (current.controller) {
            locals.$scope = lastScope;
            controller = $controller(current.controller, locals);
            newElement.contents().data('$ngControllerController', controller);
          }

          link(lastScope);
          lastScope.$emit('$viewContentLoaded');
          lastScope.$eval(onloadExp);

          // $anchorScroll might listen on event...
          $anchorScroll();
          scope.$emit('labViewUpdateFinished', null);
        }
      }
    }
  };
}]);
