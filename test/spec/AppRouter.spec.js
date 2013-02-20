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
    , init: noop
    , restore: restore
  };
};

Lungo = Lungo.mock();

describe('AppRouter', function() { 

	function navigateTo(path) {
		angular.mock.inject(function($location, $rootScope) {
			$location.path(path);
			$rootScope.$emit('$routeChangeSuccess', {});
		});
	}

  beforeEach(function() {

  	angular.mock.inject(function($location, $rootScope) {
			AppRouter.instance = new AppRouter(Lungo, $location, $rootScope);
		})
  });

  describe('Moving between articles in a section', function() {
    beforeEach(function() {
      spyOn(Lungo.Router, 'section');
      spyOn(Lungo.Router, 'back');
      Lungo.Router.history.clear();
      navigateTo('/section/firstArticle');
      navigateTo('/section/secondArticle');
      navigateTo('/section/thirdArticle');
    });

    it('should move forward first -> second -> third', function() {
      expect(Lungo.Router.history.get().length).toEqual(3);
      expect(Lungo.Router.history.get()[2]).toEqual('section/thirdArticle');
    });

    it('should not call back', function() {
      expect(Lungo.Router.back.calls.length).toEqual(0);
    })

    describe('and then to a previous article', function() {
      beforeEach(function() {
        navigateTo('/section/secondArticle');
      });

      it('should not call back if we switch to a previous article', function() {
        expect(Lungo.Router.back.calls.length).toEqual(0);
      });

      it('should move in a next fashion', function() {
        expect(Lungo.Router.history.get().length).toEqual(4);
        expect(Lungo.Router.history.get()[3]).toEqual('section/secondArticle');
      })
    });
  });

  describe('Moving between articles within different sections', function() {
    beforeEach(function() {
      spyOn(Lungo.Router, 'section');
      spyOn(Lungo.Router, 'back');
    });

  });

  describe('Moving forwards then backwards', function() {
  	beforeEach(function() {
  		spyOn(Lungo.Router, 'section');
  		spyOn(Lungo.Router, 'back');

  		navigateTo('/first');
  		navigateTo('/second');

  		navigateTo('/first');
  	})

  	it('should navigate to the previous section', function() {
  		expect(Lungo.Router.section.calls.length).toBe(2);
  		expect(Lungo.Router.back).toHaveBeenCalled();
  	});
  	it('should be the correct path', function() {
  		angular.mock.inject(function($location) {
  			expect($location.path()).toBe('/first');
  		}); 
  	})
  });

  describe("Moving forwards, forwards, backwards, forwards - cos that's the way we roll", function() {
  	beforeEach(function() {
  		spyOn(Lungo.Router, 'section');
  		spyOn(Lungo.Router, 'back');

  		navigateTo('/first');
  		navigateTo('/second');
  		navigateTo('/first');
  		navigateTo('/third');
  	});
  	it('should have 3 forward calls', function() {
  		expect(Lungo.Router.section.calls.length).toBe(3);
  	});

  	it('should have 1 back call', function() {
  		expect(Lungo.Router.back).toHaveBeenCalled();
  	});

  	it('should have the correct path', function() {
  		angular.mock.inject(function($location) {
  			expect($location.path()).toBe('/third');
  		});	
  	});
  });

	describe('Moving forwards', function() {

		it('should navigate to the appropriate section', function() {  
			spyOn(Lungo.Router, 'section');

			navigateTo('/first');
			expect(Lungo.Router.section).toHaveBeenCalled(); 
			expect(Lungo.Router.section).toHaveBeenCalledWith('first');
		});

		it('should navigate to a particular article', function() {
			spyOn(Lungo.Router, 'article');
			spyOn(Lungo.Router, 'section');

			navigateTo('/first/article');
			expect(Lungo.Router.article).toHaveBeenCalled(); 
			expect(Lungo.Router.article).toHaveBeenCalledWith('first', 'article');

			expect(Lungo.Router.section.calls.length).toBe(0);
		});

		it('should navigate forwards twice', function() { 
			spyOn(Lungo.Router, 'section');

			navigateTo('/first');
			navigateTo('/second');

			expect(Lungo.Router.section.calls.length).toBe(2); 
		})
	});
});