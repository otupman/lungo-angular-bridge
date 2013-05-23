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
  
  lab.directive('href', ['$location', '$window', function($location, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if(element[0].tagName.toUpperCase() !== 'A') {
          return;
        }
        if(attr['noHref'] !== undefined) {
          console.log('directive:href - explicit unbind, not handling taps');
          return;
        }
        var url = attr['href'];
        Lungo.dom(element[0]).on('tap', function(event) {
          $location.path(url);
          $window.location.href = url;
        });
      }
  }}])  
}(angular.module('Centralway.lungo-angular-bridge'), Lungo));