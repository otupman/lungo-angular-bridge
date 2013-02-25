'use strict';

var AppRouter = function(Lungo, $location, $scope) {
  var routingHistory = [];

  var oldReplace = $location.replace;

  var _SECTION_PATH_LENGTH = 2;
  var _SECTION_INDEX = 1;
  var _ARTICLE_INDEX = 2;

  $location.replace = function() {
    console.log('$location.replace - called!');
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
      console.log('AppRouter::showSection - transitioning to ', sectionName);
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
      Lungo.View.Aside.toggle('#' + $$(value).attr('id'));
    });
    Lungo.dom('section[class*="aside"]').removeClass('aside');
  }

  $scope.$on('$routeChangeSuccess', function(next, last) {
    console.log('AppRouter::routeChangeSuccess - route change successful to: ', $location.path(), ' current history is: ', routingHistory);
    _resetAsideStates();
    if(routingHistory.length > 0 && routingHistory[routingHistory.length-2] == $location.path() && !_hasArticle($location.path())) {
      console.log('AppRouter::routeChangeSuccess - detected back, and going there...');
      routingHistory.pop();
      try {
        Lungo.Router.back();
      } catch(e) {
        console.log('AppRouter::$routeChangeSuccess - caught exception while navigating back to ', $location.path(), ' : ', e);
        throw e;
      }
    }
    else {
      console.log('AppRouter::routeChangeSuccess - going forward to: ', $location.path(), ' current history is: ', routingHistory);

      showSection($location.path());
      if(!_isSameSection($location.path())) {
        routingHistory.push($location.path()); 
      }
    }
    Lungo.dom('*[class*="lab-view-old"]').remove()
  });



  var getPrevious = function() {
    if(routingHistory.length < 2) {
      throw new Error('No back to go back to!');
    }
    return routingHistory[routingHistory.length - 2];
  }

  var back = function() {

    if(routingHistory.length == 0) {
      console.log('AppRouter::back() - nothing to go back to :(');
      return;
    }
    var previousLocation = getPrevious();
    console.log('AppRouter::back() - going back to ', previousLocation);
    $location.path(previousLocation);
  }

  return {
    back: back
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
	.directive('labView', function($http,   $templateCache,   $route,   $anchorScroll,   $compile, $controller) {
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

      function clearContent() {
        element.html('');
        destroyLastScope();
      }

      function removePreviouslyLoadedContent(contentId) {
        var existingElement = angular.element(Lungo.dom('#' + contentId)[0]);
        existingElement.remove();
      }

      function update() {
        var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;

        if (template) {
          var targetContainer = element.parent();

          Lungo.dom('*[class*="lab-view"]').removeClass('lab-view').addClass('lab-view-old').attr('id', '');

          targetContainer.append(template);
          
          var newElement = angular.element(targetContainer.children()[targetContainer.children().length - 1]);
          newElement.addClass('lab-view');

          if(newElement.attr('id')) {
            $route.current.$route.sectionId = newElement.attr('id');
          }
          else {
            throw new Error('Elements loaded via templates must have an ID attribute');
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
        } else {
          //clearContent();
        }
      }
    }
  };
});
