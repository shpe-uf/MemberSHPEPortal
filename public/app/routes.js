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
        controller: 'alumniCtrl',
        controllerAs: 'alumni',
        authenticated: true,
        permission: ['admin', 'national', 'director']
      })

      .when('/resume', {
        templateUrl: 'app/views/pages/resume/resume.html',
        authenticated: true
      })

      .when('/admin', {
        templateUrl: 'app/views/pages/admin/admin.html',
        controller: 'adminCtrl',
        controllerAs: 'admin',
        authenticated: true,
        permission: ['admin', 'director']
      })

      .when('/statistics', {
        templateUrl: 'app/views/pages/admin/statistics.html',
        controller: 'statsCtrl',
        controllerAs: 'stats',
        authenticated: true,
        permission: ['admin']
      })

      .when('/corporate', {
        templateUrl: 'app/views/pages/corporate/corporate.html',
        controller: 'corporateCtrl',
        controllerAs: 'corporate',
        authenticated: true,
        permission: ['admin', 'national', 'director']
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

      .when('/zohoverify/verifyforzoho.html', {
        templateUrl: 'app/views/pages/verifyforzoho.html'
      })

      .when('/privacy', {
        templateUrl: 'app/views/pages/privacy.html'
      })

      .when('/team', {
        templateUrl: 'app/views/pages/team.html'
      })

      .when('/contactus', {
        templateUrl: 'app/views/pages/contact-us.html'
      })

      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

  });

app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (next.$$route !== undefined) {
      if (next.$$route.authenticated == true) {
        if (!Auth.isLoggedIn()) {
          event.preventDefault();
          $location.path('/');
        } else if (next.$$route.permission) {

          User.getPermission().then(function(data) {
            if (next.$$route.permission.length == 1) {
              if (next.$$route.permission[0] !== data.data.message) {
                event.preventDefault();
                $location.path('/');
              }
            }

            if (next.$$route.permission.length == 2) {
              if ((next.$$route.permission[0] !== data.data.message) && (next.$$route.permission[1] !== data.data.message)) {
                event.preventDefault();
                $location.path('/');
              }
            }

            if (next.$$route.permission.length == 3) {
              if ((next.$$route.permission[0] !== data.data.message) && (next.$$route.permission[1] !== data.data.message) && (next.$$route.permission[2] !== data.data.message)) {
                event.preventDefault();
                $location.path('/');
              }
            }
          });
        }

      } else if (next.$$route.authenticated == false) {
        if (Auth.isLoggedIn()) {
          event.preventDefault();
          $location.path('/profile');
        }
      }
    }
  });
}]);
