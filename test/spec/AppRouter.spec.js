'use strict';

Lungo.mock = function() {
  //TODO: Pretty sure this could be done via a spy rather than a custom mock
  return {
    Router: {
      section: function(sectionId) {}
      , article: function(sectionId, articleId) {}
      , back: function() {}
    }
    , Init: function() {}
  };
}

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