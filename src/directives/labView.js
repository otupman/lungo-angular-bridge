angular.module('Centralway.lungo-angular-bridge')
	.directive('labView', ['$http', '$templateCache', '$route', '$anchorScroll', '$compile', '$controller', '$location', '$log', function($http, $templateCache, $route, $anchorScroll, $compile, $controller, $location, $log) {
  return {
    restrict: 'ECA',
    terminal: true,
    link: function(scope, element, attr) {
      var lastScope,
          onloadExp = attr.onload || '';

      scope.$on('$routeChangeSuccess', update);
      update();


      scope.$on('$viewContentLoaded', 
        function initialiseLoadedContent() {
          var loadedContent = Lungo.dom('*[class*="lab-view"]');
          if(loadedContent.length == 0) {
            $log.error('labView::initialiseLoadedContent() - could not find class with lab-view to do a Lungo boot on');
            return;
          }
          if(!loadedContent.hasClass('lab-inited-view')) {
            $log.info('labView::viewContentLoaded - booting content');
            Lungo.Boot.Data.init('#' + loadedContent.attr('id'));
            loadedContent.addClass('lab-inited-view');
          }
          else {
            $log.warn('labView::initialiseLoadedContent() - lab-view-inited element already exists');
          }
        }
      );

      function destroyLastScope() {
        if (lastScope) {
          lastScope.$destroy();
          lastScope = null;
        }
      }

      function _archiveOldContent() {
         var oldElement = Lungo.dom('*[class*="lab-old-view"]')
         if (oldElement.length > 0) {
          oldElement.remove();
         }
         var previousElement = Lungo.dom('*[class*="lab-view"]').removeClass('lab-view').addClass('lab-old-view');
          if(previousElement.length > 0) {
            previousElement
              .attr('lab-view-old-id', previousElement.attr('id'))
              .removeAttr('id');
          }
      }

      function update() {
        var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;

        if (template && !AppRouter.instance.isSameSection($location.path())) {

          scope.$emit('$labViewUpdateStart', null);
          var targetContainer = element.parent();

          _archiveOldContent();

          var newElement = null;

          targetContainer.append(template);

          newElement = angular.element(targetContainer.children()[targetContainer.children().length - 1]);
          newElement.addClass('lab-view');

          if(!newElement.attr('id')){
            throw new Error('Elements loaded via templates must have an ID attribute');
          }

          if(AppRouter.instance.isBack($location)) {
            newElement.addClass('hide');
          }

          destroyLastScope();

          var link = $compile(newElement.contents()),
              current = $route.current,
              controller;

          lastScope = current.scope = scope.$new();
          if (current.controller) {
            locals.$scope = lastScope;
            controller = $controller(current.controller, locals);
            newElement.contents().data('$ngControllerController', controller);
          }

          link(lastScope);
          lastScope.$emit('$viewContentLoaded');
          lastScope.$eval(onloadExp);

          // $anchorScroll might listen on event...
          $anchorScroll();
          scope.$emit('labViewUpdateFinished', null);
        }
      }
    }
  };
}])