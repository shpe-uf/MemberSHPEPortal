angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'adminController', 'statsController', 'alumniController', 'resumeController'])

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
  });
