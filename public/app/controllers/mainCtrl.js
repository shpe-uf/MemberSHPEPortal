angular.module('mainController', ['authServices'])

  .controller('mainCtrl', function($timeout, $location, Auth) {

    var app = this;

    this.doLogin = function(loginData) {
      app.errorMsg = false;

      Auth.login(app.loginData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          $timeout(function() {
            $location.path('/');
          }, 1500);
        } else {
          app.errorMsg = data.data.message;
        }

      });
    };
  });
