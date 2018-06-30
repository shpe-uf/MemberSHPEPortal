angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/pages/home.html'
  })

  .when('/register', {
    templateUrl: 'app/views/pages/users/register.html'
  })

  .when('/login', {
    templateUrl: 'app/views/pages/users/login.html'
  })

  .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

});
