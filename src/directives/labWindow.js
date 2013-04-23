angular.module('Centralway.lungo-angular-bridge')
  .directive('labWindow', ['popupService', function(popupService) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var templateUrl = attrs['labWindow'];
            var options = {};
            if(attrs['transition']) {
                options.transition = attrs['transition'];
            }
            if(attrs['controller']) {
              options.controller = attrs['controller'];
            }
            element.bind("click", function () {
                popupService.showWindow(templateUrl, scope, options);
            });
        }
    };
  }]) 