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
  });
