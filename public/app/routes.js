var app = angular.module('appRoutes', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/pages/home.html'
      })

      .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
      })

      .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
      })

      .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
      })

      .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
      })

      .when('/rewards', {
        templateUrl: 'app/views/pages/rewards/rewards.html',
        authenticated: true
      })

      .when('/alumni', {
        templateUrl: 'app/views/pages/alumni/alumni.html',
        authenticated: true
      })

      .when('/resume', {
        templateUrl: 'app/views/pages/resume/resume.html',
        authenticated: true
      })

      .when('/admin', {
        templateUrl: 'app/views/pages/admin/admin.html',
        authenticated: true
      })

      .when('/forgotusername', {
        templateUrl: 'app/views/pages/users/reset/username.html',
        controller: 'usernameCtrl',
        controllerAs: 'username',
        authenticated: false
      })

      .when('/forgotpassword', {
        templateUrl: 'app/views/pages/users/reset/password.html',
        controller: 'passwordCtrl',
        controllerAs: 'password',
        authenticated: false
      })

      .when('/reset/:token', {
        templateUrl: 'app/views/pages/users/reset/newpassword.html',
        controller: 'resetCtrl',
        controllerAs: 'reset',
        authenticated: false
      })

      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

  });

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {

  $rootScope.$on('$routeChangeStart', function(event, next, current) {

    if (next.$$route.authenticated == true) {
      if (!Auth.isLoggedIn()) {
        event.preventDefault();
        $location.path('/');
      }
    } else if (next.$$route.authenticated == false) {
      if (Auth.isLoggedIn()) {
        event.preventDefault();
        $location.path('/profile');
      }
    }
  });
}]);
