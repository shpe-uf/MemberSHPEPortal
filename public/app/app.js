angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'adminController', 'statsController', 'resumeController'])

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
  });
