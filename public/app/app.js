angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController', 'adminController'])

    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    });
