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
    return {
      restrict: 'A'
      , link: function(scope, element, attr) {
        element.bind('click', function() {
          Lungo.View.Aside.toggle('#' + element.attr('lab-aside'));
        });
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
	.directive('labView', ['$http', '$templateCache', '$route', '$anchorScroll', '$compile', '$controller', '$location', '$log', function($http, $templateCache, $route, $anchorScroll, $compile, $controller, $location, $log) {
  return {
    restrict: 'ECA',
    terminal: true,
    link: function(scope, element, attr) {
      var lastScope,
          onloadExp = attr.onload || '';

      scope.$on('$routeChangeSuccess', update);
      update();


      scope.$on('$viewContentLoaded', 
        function initialiseLoadedContent() {
          var loadedContent = Lungo.dom('*[class*="lab-view"]');
          if(loadedContent.length == 0) {
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
        }
      );

      function destroyLastScope() {
        if (lastScope) {
          lastScope.$destroy();
          lastScope = null;
        }
      }

      function _archiveOldContent() {
         var oldElement = Lungo.dom('*[class*="lab-old-view"]')
         if (oldElement.length > 0) {
          oldElement.remove();
         }
         var previousElement = Lungo.dom('*[class*="lab-view"]').removeClass('lab-view').addClass('lab-old-view');
          if(previousElement.length > 0) {
            previousElement
              .attr('lab-view-old-id', previousElement.attr('id'))
              .removeAttr('id');
          }
      }

      function update() {
        var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;

        if (template && !AppRouter.instance.isSameSection($location.path())) {

          scope.$emit('$labViewUpdateStart', null);
          var targetContainer = element.parent();

          _archiveOldContent();

          var newElement = null;

          targetContainer.append(template);

          newElement = angular.element(targetContainer.children()[targetContainer.children().length - 1]);
          newElement.addClass('lab-view');

          if(!newElement.attr('id')){
            throw new Error('Elements loaded via templates must have an ID attribute');
          }

          if(AppRouter.instance.isBack($location)) {
            newElement.addClass('hide');
          }

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
}])
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
  }])
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
  }])
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
