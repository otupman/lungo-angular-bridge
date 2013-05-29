/*! lungo-angular-bridge - v0.1.3 - 2013-05-31 */
angular.module('Centralway.lungo-angular-bridge', [])
  .value('labOptions', {}); ;var AppRouter = function(Lungo, $location, $scope) {
  var routingHistory = [];

  var oldReplace = $location.replace;

  var _SECTION_PATH_LENGTH = 2;
  var _SECTION_INDEX = 1;
  var _ARTICLE_INDEX = 2; 

  var _CONTENT_REMOVAL_TIMEOUTMS = 500; 

  $location.replace = function() {
    $location.$$replace = true;
    return $location;
  };

  var _hasArticle = function(path) {
    var splitPath = angular.isArray(path) ? path : path.split('/');
    return splitPath.length > _SECTION_PATH_LENGTH;
  };

  var _assertElementExists = function(id) {
    if(id.indexOf('#') === -1) {
      id = '#' + id;
    }
    if(Lungo.dom(id).length === 0) {
      throw new Error('No such element with ID [' + id + ']');
    }
  };

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
    if(routingHistory.length === 0) {
      return false;
    }
    var currentPathParts = routingHistory[routingHistory.length-1].split('/');
    var pathParts = path.split('/');
    return currentPathParts[_SECTION_INDEX] === pathParts[_SECTION_INDEX];
  };

  var _resetAsideStates = function() {
    var openAsides = Lungo.dom('aside[class*="show"]');
    angular.forEach(openAsides, function(value) {
      Lungo.View.Aside.toggle('#' + Lungo.dom(value).attr('id'));
    });
    Lungo.dom('section[class*="aside"]').removeClass('aside');
  };

  var _isBack = function($location) {
    if(_isSameSection($location.path())) {
      return routingHistory.length > 0 
          && routingHistory[routingHistory.length-2] === $location.path() 
          && !_hasArticle($location.path());
    }
    else {
      return routingHistory.length > 0 
          && routingHistory[routingHistory.length-2] === $location.path();
    }
  };

  var isBack = function() {
    return _isBack($location);
  };
  
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
  };

  var back = function() {

    if(routingHistory.length === 0) {
      return;
    }
    var previousLocation = getPrevious();
    $location.path(previousLocation);
  };

  return {
    back: back
    , isBack: isBack
    , isSameSection: _isSameSection
  };

};;/**
 * directive: lab-aside
 * NOTE: lab aside can be configured via lab-boot with swipe-on-asides = true/false to
 * enable/disable swipe-to-open the aside. 
 * FURTHER NOTE: this only works if the lab-aside attribute is in a template loaded via lab-view
 * because otherwise lab-boot is processed *after* the binding of the events :(
 *
 */
angular.module('Centralway.lungo-angular-bridge')
  .directive('labAside', ['labOptions', function(labOptions) {
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
        var options = {};
        options.swipeEnabled = attr['noSwipe'] ? false : labOptions.doAsideSwipe;
        var asideId = element.attr('lab-aside');
        //var targetEvent = Lungo.Core.environment().isMobile ? 'tap' : 'click';
        var targetEvent = 'tap';
        //TODO: deprecate this environment selection in favour of tap-only
        Lungo.dom(element[0]).bind(targetEvent, function(event) {
          Lungo.View.Aside.toggle('#' + asideId);
          event.preventDefault();
        });
        if(options.swipeEnabled) {
          subscribeEvents(Lungo.dom(element[0]));
        }
      }
    }  
}]);
;angular.module('Centralway.lungo-angular-bridge')
  .directive('labBoot', ['$location', function($location) {
      function _parseResourceParam(param) {
        return param.indexOf(',') === -1 ? param : param.split(',');
      }
    
      function _getOptionBoolean(attrs, optionName, defaultValue) {
        if(!attrs[optionName]) {
          return defaultValue;
        }
        if(attrs[optionName].length === 0) {
          return true;
        }
        return attrs[optionName].toLowerCase() === 'true';
      }
    
      return function(scope, elm, attrs) {
        Lungo.init({
          'resources': elm.attr('resources') && _parseResourceParam(elm.attr('resources'))
        });
        var labOptions = {
          doAsideSwipe: _getOptionBoolean(attrs, 'asideSwiping', true)
        };
        angular.module('Centralway.lungo-angular-bridge').value('labOptions', labOptions);
        AppRouter.instance = AppRouter(Lungo, $location, scope);
      };
    }]);(function(lab, Lungo) {
  var quoEvents = 'swipe swiping swipeLeft swipeRight swipeDown swipeUp'
    + ' tap hold singleTap doubleTap'
    + ' pinch pinching pinchIn pinchOut'
    + ' rotate rotating rotateLeft rotateRight';
  angular.forEach(
    quoEvents.split(' '),
    function(name) {
      var normalisedName = name.charAt(0).toUpperCase() + name.slice(1);
      var directiveName = 'lab' + normalisedName;
      lab.directive(directiveName, ['$parse', function($parse) {
        return {
          restrict: 'A',
          link: function(scope, element, attr) {
            var fn = $parse(attr[directiveName]);
            Lungo.dom(element[0]).on(name, function(event) {
              event.preventDefault();
              scope.$apply(function() {
                fn(scope, {$event:event});
              }); 
            });
          }
        };
      }]);

    });
  
  lab.directive('href', ['$location', function($location) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if(element[0].tagName.toUpperCase() !== 'A') {
          return;
        }
        if(attr['noHref'] !== undefined) {
          console.log('directive:href - explicit unbind, not handling taps');
          return;
        }
        var url = attr['href'];
        Lungo.dom(element[0]).on('tap', function(event) {
          Lungo.dom(element[0]).trigger('click');
        });
      }
  }}])  
}(angular.module('Centralway.lungo-angular-bridge'), Lungo));
;angular.module('Centralway.lungo-angular-bridge')
  .directive('labPopup', ['popupService', function (popupService) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var templateUrl = attrs['labPopup'];
            var popupOptions = {};
            if(attrs['controller']) {
              popupOptions.controller = attrs['controller'];
            }
            element.bind("click", function () {
                popupService.load(templateUrl, scope, popupOptions);
            });
        }
    };
  }]);angular.module('Centralway.lungo-angular-bridge')
	.directive('labView', ['$http', '$templateCache', '$route', '$anchorScroll', '$compile', '$controller', '$location', '$log', function($http, $templateCache, $route, $anchorScroll, $compile, $controller, $location, $log) {      
      
  var initialiseLoadedContent = function(targetElement) {
    var isReRun = targetElement === undefined;
    var loadedContent = !isReRun ? Lungo.dom(targetElement[0]) : Lungo.dom('*[class*="lab-view"]');
    if(loadedContent.length === 0) {
      $log.error('labView::initialiseLoadedContent() - could not find class with lab-view to do a Lungo boot on');
      return;
    }
    if(!loadedContent.hasClass('lab-inited-view')) {
      $log.info('labView::viewContentLoaded - booting content');
      Lungo.Boot.Data.init('#' + loadedContent.attr('id'));
      
      loadedContent.addClass('lab-inited-view');
    }
    else {
      $log.warn('labView::initialiseLoadedContent() - lab-view-inited element already exists');
    }
  };
      
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
          
          initialiseLoadedContent(newElement);
          
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
          //initialiseLoadedContent();
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
}]);angular.module('Centralway.lungo-angular-bridge')
  .directive('labWindow', ['popupService', function(popupService) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var templateUrl = attrs['labWindow'];
            var options = {};
            if(attrs['transition']) {
                options.transition = attrs['transition'];
            }
            if(attrs['controller']) {
              options.controller = attrs['controller'];
            }
            element.bind("click", function () {
                popupService.showWindow(templateUrl, scope, options);
            });
        }
    };
  }]) ;(function(Lungo, services, AppRouter) {
  
  services.service('labRouterService', [function() {
    return {
      back: function() { AppRouter.instance.back(); }
      , isBack: function() { return AppRouter.instance.isBack(); }
      , isSameSection: function(path) { return AppRouter.instance.isSameSection(path); }
    };
  }]);
  
  
})(Lungo, angular.module('Centralway.lungo-angular-bridge'), AppRouter);;angular.module('Centralway.lungo-angular-bridge')
  .factory('popupService', ['$http', '$compile', '$timeout', function ($http, $compile, $timeout) {
    var popupService = {};

    // Get the popup
    popupService.getPopup = function (create) {
        if (!popupService.popupElement && create) {
            popupService.popupElement = $$('<div class="notification"><div class="window show"></div></div>');
            $$(window.document.body).append(popupService.popupElement);
        }

        return popupService.popupElement;
    }

    popupService.compileAndRunPopup = function (popup, scope, options) {
        
        var ngPopup = angular.element(popup[0]);
        $compile(ngPopup)(scope);
        popup.show();
    }
 
    // Loads the popup
    popupService.load = function (url, scope, options) {
        var htmlPage = '<div ng-include="\'' + url + '\'"></div>';

       $http.get(undefined).success(function (data) { // TODO: Uhh, why does this need to be here?!?!?!
            var autoPopup = popupService.getPopup(true);
            var popup = autoPopup;
            popup.find('div').html(htmlPage);
            popupService.compileAndRunPopup(popup, scope, options);
        }); 
    }
    
    popupService.getWindow = function(create) {
        if(!popupService.windowElement && create) {
            var randomNumber = Math.floor(Math.random() * (999999 + 1));
            var id = randomNumber + new Date().getTime();
            var section = $$('<section id="section_' + id + '" ng-include=""></section>');
            $$(window.document.body).append(section);
            popupService.windowElement = section;
        }
        return popupService.windowElement;
    }
    
    // Loads the popup
    popupService.showWindow = function (url, scope, options) {
      var transition = options.transition || '';
      
      var popup = popupService.getWindow(true);
      popup.attr('ng-include', "'" + url + "'");
      popup.attr('data-transition', transition);
      if(options.controller) {
        popup.attr('ng-controller', options.controller);
      }
      var ngPopup = angular.element(popup[0]);
      $compile(ngPopup)(scope); 
      
      scope.$on('$includeContentLoaded', function() {
		Lungo.Boot.Data.init('#' + popup.attr('id'));
      });
      //TODO: Determine why this timeout makes everything magically work - my guess is it's a digest issue and this should be hooking into an event from Angular
      $timeout(function() {
        Lungo.Router.section(popup.attr('id'));
      }, 1);      
    };


    popupService.close = function () {
        var popup = popupService.getPopup()
        var section = popupService.getWindow();
        if (popup) {
            popup.hide();
            popup.remove();
            delete popupService.popupElement;
        }
        if(section) {
            Lungo.Router.back();
            $timeout(function() {
                section.remove();
                delete popupService.windowElement;
            }, 400);
        }
        
    }

    return popupService;

}]);
