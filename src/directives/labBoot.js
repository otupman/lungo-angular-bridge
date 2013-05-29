angular.module('Centralway.lungo-angular-bridge')
  .directive('labBoot', ['$location', function($location) {
      function _parseResourceParam(param) {
        return param.indexOf(',') === -1 ? param : param.split(',');
      }
    
      function _getOptionBoolean(attrs, optionName, defaultValue) {
        if(!attrs[optionName]) {
          return defaultValue;
        }
        if(attrs[optionName].length === 0) {
          return true;
        }
        return attrs[optionName].toLowerCase() === 'true';
      }
    
      return function(scope, elm, attrs) {
        Lungo.init({
          'resources': elm.attr('resources') && _parseResourceParam(elm.attr('resources'))
        });
        var labOptions = {
          doAsideSwipe: _getOptionBoolean(attrs, 'asideSwiping', true)
        };
        angular.module('Centralway.lungo-angular-bridge').value('labOptions', labOptions);
        AppRouter.instance = AppRouter(Lungo, $location, scope);
      };
    }])