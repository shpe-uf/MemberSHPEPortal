angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'adminController', 'statsController', 'alumniController'])

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
  });
