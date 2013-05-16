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

};