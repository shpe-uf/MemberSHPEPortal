angular.module('emailController', ['userServices'])

  .controller('usernameCtrl', function(User) {

    app = this;

    app.sendUsername = function(userData, valid) {
      app.errorMsg = false;

      if (valid) {
        User.sendUsername(app.userData.email).then(function(data) {
          if (data.data.success) {
            app.successMsg = data.data.message;
          } else {
            app.errorMsg = data.data.message;
          }
        });
      } else {
        app.errorMsg = 'Please enter a valid email';
      }
    };
  })

  .controller('passwordCtrl', function(User) {

    app = this;

    app.sendPassword = function(resetData, valid) {
      app.errorMsg = false;

      if (valid) {
        User.sendPassword(app.resetData).then(function(data) {
          if (data.data.success) {
            app.successMsg = data.data.message;
            $timeout(function() {
              $location.path('/path');
            }, 1000);
          } else {
            app.errorMsg = data.data.message;
          }
        });
      } else {
        app.errorMsg = 'Please enter a valid username';
      }
    };
  })

  .controller('resetCtrl', function(User, $routeParams, $scope) {

    app = this;
    app.hide = true;

    User.resetUser($routeParams.token).then(function(data) {

      if (data.data.success) {
        app.hide = false;
        app.successMsg = 'Please enter a new password';

        $scope.username = data.data.user.username;

      } else {
        app.errorMsg = data.data.message;
      }
    });

    app.savePassword = function(regData, valid) {
      app.errorMsg = false;

      if (valid) {
        app.regData.username = $scope.username;
        User.savePassword(app.regData).then(function(data) {
          if (data.data.success) {
            app.successMsg = data.data.message;
          } else {
            app.errorMsg = data.data.message.errors.password.message;
          }
        });
      } else {
        app.errorMsg = 'Please ensure the form is filled out properly';
      }
    }

  });
