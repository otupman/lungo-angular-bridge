angular.module('Centralway.lungo-angular-bridge')
	.directive('labView', ['$http', '$templateCache', '$route', '$anchorScroll', '$compile', '$controller', '$location', '$log', function($http, $templateCache, $route, $anchorScroll, $compile, $controller, $location, $log) {
  var removeLungoAttributes = function(element) {
    /*
     * !NOTE: this is intentionally hardcoded to ensure speed of search
     * 
     * Taken from Lungo.Attributes
    */
     element
        .find('[data-count],[data-pull],[data-progress],[data-label],[data-icon],[data-image],[data-title],[data-loading]')
        .removeAttr('data-count')
        .removeAttr('data-pull')
        .removeAttr('data-progress')
        .removeAttr('data-label')
        .removeAttr('data-icon')
        .removeAttr('data-image')
        .removeAttr('data-title')
        .removeAttr('data-loading');
  };
      
      
  var initialiseLoadedContent = function(targetElement) {
    var isReRun = targetElement === undefined;
    var loadedContent = !isReRun ? Lungo.dom(targetElement[0]) : Lungo.dom('*[class*="lab-view"]');
    if(loadedContent.length === 0) {
      $log.error('labView::initialiseLoadedContent() - could not find class with lab-view to do a Lungo boot on');
      return;
    }
    if(isReRun || !loadedContent.hasClass('lab-inited-view')) {
      $log.info('labView::viewContentLoaded - booting content');
      Lungo.Boot.Data.init('#' + loadedContent.attr('id'));
      removeLungoAttributes(loadedContent);
      
      loadedContent.addClass('lab-inited-view');
    }
    else {
      $log.warn('labView::initialiseLoadedContent() - lab-view-inited element already exists');
    }
  };
      
  return {
    restrict: 'ECA',
    terminal: true,
    link: function(scope, element, attr) {
      var lastScope,
          onloadExp = attr.onload || '';

      scope.$on('$routeChangeSuccess', update);
      update();

      

      scope.$on('$viewContentLoaded', function() {
        initialiseLoadedContent(); 
      });

      function destroyLastScope() {
        if (lastScope) {
          lastScope.$destroy();
          lastScope = null;
        }
      }

      function retrieveCurrentLabView() {
        return Lungo.dom('*[class*="lab-view"]');
      }

      function _archiveOldContent(currentLabView) {

         var oldElement = Lungo.dom('*[class*="lab-old-view"]')
         if (oldElement.length > 0) {
          oldElement.remove();
         }
         
         currentLabView.removeClass('lab-view').addClass('lab-old-view');

          if(currentLabView.length > 0) {
            currentLabView
              .attr('lab-view-old-id', currentLabView.attr('id'))

              .removeAttr('id');
          }
      }

      function update() {
        var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;

        if (template && !AppRouter.instance.isSameSection($location.path())) {

          scope.$emit('$labViewUpdateStart', null);
          var targetContainer = element.parent();

          var currentLabView = retrieveCurrentLabView();
          _archiveOldContent(currentLabView);

          var newElement = null;

          targetContainer.append(template);

          newElement = angular.element(targetContainer.children()[targetContainer.children().length - 1]);
          newElement.addClass('lab-view');

          if(!newElement.attr('id')){
            throw new Error('Elements loaded via templates must have an ID attribute');
          }

          if(AppRouter.instance.isBack($location)) {
            var currentLabViewTransition = currentLabView.data('transition');
            newElement.attr('data-transition-origin', currentLabViewTransition);

            newElement.addClass('hide');
          }
          
          initialiseLoadedContent(newElement);
          
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
          //initialiseLoadedContent();
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