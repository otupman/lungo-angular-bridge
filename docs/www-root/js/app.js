(function(angular) {
  'use strict';
  angular.module('LabWebRoot', [])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      
      $routeProvider.when('/examples', {templateUrl: 'partials/examples.html', controller: 'DemoCtrl'});
      $routeProvider.when('/', {templateUrl: 'partials/root.html', controller: 'RootCtrl'});
      $routeProvider.when('/docs/api', {templateUrl: 'partials/api.html'});
      
      $routeProvider.otherwise({redirectTo: '/'});
      $locationProvider.html5Mode(true);
      
    }])
    .directive('markdown', ['$http', function($http) {
      var converter = new Showdown.converter({ extensions: ['prettify'] });
      return {
        restrict: 'E',
        link: function(scope, element, attrs) {
          if(attrs['src']) {
            var mdFileUrl = attrs['src'];
            $http.get(mdFileUrl).success(function(data) {
              element.html(converter.makeHtml(data));
            }).error(function(data, status, headers, config) {
              console.log('Error obtaining ' + mdFileUrl + ': ' + status);
              console.log(data);
              element.html('Error reading file: ' + mdFileUrl);
            });
          }
          else {
            element.html(converter.makeHtml(element.text()));
          }
        }
      }
    }])
    .controller('RootCtrl', ['$scope', function($scope) {
      
    }])
    .controller('DemoCtrl', ['$scope', function($scope) {
      
      $scope.availableDemos = [
        {'name': 'simple', label: 'Simple Demo'}
        , {'name': 'todo', label: 'Todo Demo'}
        , {'name': 'photomap', label: 'Photomap Demo'}
      ];
      
      $scope.selectedDemo = 'simple';
      
      $scope.showDemo = function(demoName) {
        $scope.selectedDemo = demoName;
      };
    }])
  ;
}(angular));