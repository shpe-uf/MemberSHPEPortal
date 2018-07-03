angular.module('mainController', ['authServices'])

  .controller('mainCtrl', function($timeout, $location, $rootScope, Auth) {
    var app = this;

    app.loadme = false;

    $rootScope.$on('$routeChangeStart', function() {
      if (Auth.isLoggedIn()) {
        app.isLoggedIn = true;
        Auth.getUser().then(function(data) {
          app.firstName = data.data.firstName;
          app.lastName = data.data.lastName;
          app.email = data.data.email;
          app.major = data.data.major;
          app.year = data.data.year;

          app.loadme = true;
        });
      } else {
        app.isLoggedIn = false;
        app.firstName = '';
        app.lastName = '';
        app.email = '';
        app.major = '';
        app.year = '';
        app.loadme = true;
      }
    });

    this.doLogin = function(loginData) {
      app.errorMsg = false;

      Auth.login(app.loginData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          $timeout(function() {
            $location.path('/profile');
            app.loginData = '';
            app.successMsg = false;
          }, 1000);
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };

    this.logout = function() {
      Auth.logout();
      $location.path('/logout');
      $timeout(function() {
        $location.path('/');
      }, 1000);
    };

  });
