(function(lab, Lungo) {
  var quoEvents = 'swipe swiping swipeLeft swipeRight swipeDown swipeUp'
    + ' tap hold singleTap doubleTap'
    + ' pinch pinching pinchIn pinchOut'
    + ' rotate rotating rotateLeft rotateRight';
  angular.forEach(
    quoEvents.split(' '),
    function(name) {
      var normalisedName = name.charAt(0).toUpperCase() + name.slice(1);
      var directiveName = 'lab' + normalisedName;
      lab.directive(directiveName, ['$parse', function($parse) {
        return {
          restrict: 'A',
          link: function(scope, element, attr) {
            var fn = $parse(attr[directiveName]);
            Lungo.dom(element[0]).on(name.toLowerCase(), function(event) {
              event.preventDefault();
              scope.$apply(function() {
                fn(scope, {$event:event});
              });
            });
          }
        };
      }]); 
      
    });
}(angular.module('Centralway.lungo-angular-bridge'), Lungo));