angular.module('Centralway.lungo-angular-bridge')
  .directive('labAside', function() {
    return {
      restrict: 'A'
      , link: function(scope, element, attr) {
        element.bind('click', function() {
          Lungo.View.Aside.toggle('#' + element.attr('lab-aside'));
        });
      }
    }
  });