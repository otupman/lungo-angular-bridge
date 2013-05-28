'use strict';
 
describe('AppRouter', function() { 
  
  beforeEach(function() { 
    angular.mock.module('Centralway.lungo-angular-bridge');
    Lungo.Router.history = [];
    spyOn(Lungo.View.Aside, 'show');
    spyOn(Lungo, 'dom').andCallFake(function(selector) {
      var response = [''];
      response.addClass = jasmine.createSpy('addClass');
      response.hasClass = jasmine.createSpy('hasClass');
      response.removeClass = jasmine.createSpy('removeClass');
      response.attr = jasmine.createSpy('attr');
      return response;
    });
    
    // Here we fake $location.path so that we can manually emit $routeChangeSuccess
    angular.mock.inject(function($location, $rootScope) {
      
      $location.oldPath = $location.path;
      spyOn($location, 'path').andCallFake(function(path) {
        if(path) {
          $location.oldPath(path);
          $rootScope.$emit('$routeChangeSuccess', {});
        } else {
          return $location.oldPath();
        }
      });
    });
  });

  function navigateTo(path) {
    angular.mock.inject(function($location, $rootScope) {
      $location.path(path);
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
      spyOn(Lungo.Router, 'article').andCallFake(function(sectionId, articleId) {
        Lungo.Router.history.push(sectionId + '/' + articleId);
      });
      Lungo.Router.history = [];
      navigateTo('/section/firstArticle');
      navigateTo('/section/secondArticle');
      navigateTo('/section/thirdArticle'); 
    });

    it('should move forward first -> second -> third', function() {
      expect(Lungo.Router.history.length).toEqual(3);
    });

    it('should recognise a same section situation', function() {
      expect(AppRouter.instance.isSameSection('/section/secondArticle')).toBeTruthy();
      inject(function(labRouterService) {
        expect(labRouterService.isSameSection('/section/secondArticle')).toBeTruthy();
      });
    });
    
    it('should recognise a non-same section', function() {
      navigateTo('/otherSection/thing');
      expect(AppRouter.instance.isSameSection('/section/secondArticle')).toBeFalsy();
      inject(function(labRouterService) {
        expect(labRouterService.isSameSection('/section/secondArticle')).toBeFalsy();
      });
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
        expect(Lungo.Router.history.length).toEqual(4); 
        expect(Lungo.Router.history[3]).toEqual('section/secondArticle');
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

  describe('forward, forward, back, back', function() {
    beforeEach(function() {
      spyOn(Lungo.Router, 'section');
      spyOn(Lungo.Router, 'back');
      spyOn(Lungo.Router, 'article');
    });
    
    describe('with just sections', function() {
      beforeEach(function() {  
        navigateTo('/first');
        navigateTo('/second');
        navigateTo('/third');
      });
  
      it('should go back twice - AppRouter.instance.back()', function() {
        AppRouter.instance.back();        
        AppRouter.instance.back();
        
        angular.mock.inject(function($location) {
          expect($location.path()).toBe('/first');
        });  
      });
      
      it('using the service it should go back twice', function() {
        inject(function(labRouterService) {
          labRouterService.back();
          labRouterService.back();
        });
        
        angular.mock.inject(function($location) {
          expect($location.path()).toBe('/first');
        });  
      });
  
      it('should go back twice - navigateTo', function() {
        navigateTo('/second');
        navigateTo('/first');
        angular.mock.inject(function($location) {
          expect($location.path()).toBe('/first');
        });
      });
    });
        
    //TODO(otupman): this is copy and paste from above; should make it better.
    describe('with sections and articles', function() {
      beforeEach(function() {  
        navigateTo('/first/article');
        navigateTo('/second/article');
        navigateTo('/third/article');
      });
      
      it('should go back twice - AppRouter.instance.back()', function() {
        AppRouter.instance.back();        
        AppRouter.instance.back();
        
        angular.mock.inject(function($location) {
          expect($location.path()).toBe('/first/article');
        });  
      });
  
      it('should go back twice - navigateTo', function() {
        navigateTo('/second/article');
        navigateTo('/first/article');
        angular.mock.inject(function($location) {
          expect($location.path()).toBe('/first/article');
        });
      });
    });
    
    //TODO(otupman): More copy paste? Ow, my eyes!
    describe('with sections and articles AND IDs', function() {
      beforeEach(function() {  
        navigateTo('/first/article/1');
        navigateTo('/second/article/2');
        navigateTo('/third/article/3');
      });
      
      it('should go back twice - AppRouter.instance.back()', function() {
        AppRouter.instance.back();        
        AppRouter.instance.back();
        
        angular.mock.inject(function($location) {
          expect($location.path()).toBe('/first/article/1');
        });  
      });
  
      it('should go back twice - navigateTo', function() {
        navigateTo('/second/article/2');
        navigateTo('/first/article/1');
        angular.mock.inject(function($location) {
          expect($location.path()).toBe('/first/article/1');
        });
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