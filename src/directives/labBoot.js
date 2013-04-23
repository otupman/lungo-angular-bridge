angular.module('Centralway.lungo-angular-bridge')
  .directive('labBoot', ['$location', function($location) {
      function _parseResourceParam(param) {
        return param.indexOf(',') === -1 ? param : param.split(',');
      }
      return function(scope, elm, attrs) {
        Lungo.init({
          'resources': elm.attr('resources') && _parseResourceParam(elm.attr('resources'))
        });
        AppRouter.instance = AppRouter(Lungo, $location, scope);
      };
    }])