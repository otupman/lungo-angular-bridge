angular.module('Centralway.lungo-angular-bridge')
  .directive('labPopup', ['popupService', function (popupService) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var templateUrl = attrs['labPopup'];
            var popupOptions = {};
            if(attrs['controller']) {
              popupOptions.controller = attrs['controller'];
            }
            element.bind("click", function () {
                popupService.load(templateUrl, scope, popupOptions);
            });
        }
    };
  }])