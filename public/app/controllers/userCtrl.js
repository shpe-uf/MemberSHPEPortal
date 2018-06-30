angular.module('userControllers', ['userServices'])

  .controller('regCtrl', function($http, $location, $timeout, User) {

    var app = this;

    this.regUser = function(regData) {
      app.errorMsg = false;

      User.create(app.regData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          $timeout(function() {
            $location.path('/login');
          }, 1500);
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };
  });
