angular.module('userControllers', ['userServices'])

  .controller('regCtrl', function($http, $location, User) {

    var app = this;

    this.regUser = function(regData) {
      app.errorMsg = false;

      User.create(app.regData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          $location.path('/');
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };
  });
