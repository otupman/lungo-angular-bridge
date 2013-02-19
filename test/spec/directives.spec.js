'use strict';

Lungo.mock = function() {
	//TODO: Pretty sure this could be done via a spy rather than a custom mock
	return {
		Router: {
			section: function(sectionId) {}
			, article: function(sectionId, articleId) {}
			, back: function() {}
		}
		, init: function() {}
	};
}

Lungo = Lungo.mock();

describe('directives', function() {
	beforeEach(function() {
		angular.mock.module('Centralway.lungo-angular-bridge');
		spyOn(Lungo, 'init');
  });

	describe('lab-routing', function() {
		it('should call Lungo init', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<div lab-routing></div>')($rootScope);
        expect(Lungo.init).toHaveBeenCalled();
      });

      
		});
	});

});