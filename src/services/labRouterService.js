(function(Lungo, services, AppRouter) {
  
  services.service('labRouterService', [function() {
    return {
      back: function() { AppRouter.instance.back(); }
      , isBack: function() { AppRouter.instance.isBack(); }
      , isSameSection: function(path) { AppRouter.instance.isSameSection(path); }
    };
  }]);
  
  
})(Lungo, angular.module('Centralway.lungo-angular-bridge'), AppRouter);