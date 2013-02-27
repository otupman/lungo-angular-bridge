'use strict';

Lungo.mock = function() {
  var _oldLungo = Lungo;
  console.log('whee');
  var _absoluteHistory = [];
  //TODO: Pretty sure this could be done via a spy rather than a custom mock
  var section = function(sectionId) {
    _absoluteHistory.push(sectionId);
  };

  var article = function(sectionId, articleId) {
    _absoluteHistory.push(sectionId + '/' + articleId);
  }

  var back = function() {
    _absoluteHistory.pop();
  }

  var getHistory = function() {
    return _absoluteHistory;
  }

  var clearHistory = function() {
    _absoluteHistory = [];
  }

  var restore = function() {
    Lungo = _oldLungo;
  }

  var dom = function() {
    return {
      removeClass: noop
      , attr: noop
    };
  }

  var noop = function() {};

  return {
    Router: {
      section: section
      , article: article
      , back: back
      , history: {
        get: getHistory
        , clear: clearHistory
      }
    }
    , View: {
      Aside: {
        toggle: noop
      }
    }
    , init: noop
    , restore: restore
    , dom: dom
  };
};

Lungo = Lungo.mock();

describe('directives', function() {
	beforeEach(function() {
		angular.mock.module('Centralway.lungo-angular-bridge');
		spyOn(Lungo, 'init');
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
		})

	});

});