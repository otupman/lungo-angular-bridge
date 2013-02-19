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

describe('directives', function() {
	beforeEach(function() {
		angular.module('Centralway.lungo-angular-bridge');
  // 	angular.mock.inject(function($location, $rootScope) {
		// 	AppRouter.instance = new AppRouter(Lungo, $location, $rootScope);
		// })
		spyOn(Lungo, 'Init');
  });

	describe('lab-routing', function() {
		it('should call Lungo init', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<body lab-routing></body>')($rootScope);
        console.log(element);
        expect(Lungo.Init).toHaveBeenCalled();
      });

      
		});
	});

});