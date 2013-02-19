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
        expect(Lungo.init.mostRecentCall.args[0]).toEqual({});
      });

      
		});

		describe('with resources', function() {
			it('should pass on a single file correctly', function() {
				inject(function($compile, $rootScope) {
					var element = $compile('<div lab-routing resources="singleFile.html"></div>')($rootScope);
					expect(Lungo.init.mostRecentCall.args[0]).toEqual({resources: 'singleFile.html'});
				});
			});

			it('should pass on a file list correctly', function() {
				inject(function($compile, $rootScope) {
					var element = $compile('<div lab-routing resources="first.html,second.html"></div>')($rootScope);
					expect(Lungo.init.mostRecentCall.args[0]).toEqual({resources: ['first.html', 'second.html']});
				});
			});
		})

	});

});