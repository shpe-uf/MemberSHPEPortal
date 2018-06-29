angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/pages/home.html'
  })

  .when('/sign-up', {
    templateUrl: 'app/views/pages/sign-up.html'
  })

  .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

});
