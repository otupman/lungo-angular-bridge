angular.module('Centralway.lungo-angular-bridge')
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
      //TODO: Determine why this timeout makes everything magically work - my guess is it's a digest issue and this should be hooking into an event from Angular
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
