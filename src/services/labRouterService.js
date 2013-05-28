(function(Lungo, services, AppRouter) {
  
  services.service('labRouterService', [function() {
    return {
      back: function() { AppRouter.instance.back(); }
      , isBack: function() { return AppRouter.instance.isBack(); }
      , isSameSection: function(path) { return AppRouter.instance.isSameSection(path); }
    };
  }]);
  
  
})(Lungo, angular.module('Centralway.lungo-angular-bridge'), AppRouter);