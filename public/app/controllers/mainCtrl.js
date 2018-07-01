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
          app.loadme = true;
        });
      } else {
        app.isLoggedIn = false;
        app.firstName = '';
        app.lastName = '';
        app.loadme = true;
      }
    });

    this.doLogin = function(loginData) {
      app.errorMsg = false;

      Auth.login(app.loginData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          $timeout(function() {
            $location.path('/');
            app.loginData = '';
            app.successMsg = false;
          }, 1500);
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
      }, 1500);
    };

  });
