angular.module('adminController', [])
  .controller('adminCtrl', function($scope, User) {

    var app = this;
    app.accessDenied = true;

    this.openCreateEventModal = function() {
      $("#createEventModal").modal({
        backdrop: "static"
      });
    };

    this.createEvent = function(eventData) {
      console.log("CREATE EVENT");
      console.log(app.eventData);

      app.errorMsg = false;

      User.createCode(app.eventData).then(function(data) {
        if (data.data.success) {
          console.log("SUCCESS!");
        } else {
          console.log("FAILURE!");
          console.log(data.data.message);
        }
      });
    };

    User.getUsers().then(function(data) {
      console.log("GET USERS");
      if (data.data.success) {
        if (data.data.permission === 'admin') {
          app.users = data.data.message;
          app.accessDenied = false;
        } else {
          app.errorMsg = 'Insufficient permission';
        }
      } else {
        app.errorMsg = data.data.message;
      }
    });

    User.getCodes().then(function(data) {
      console.log("GET CODES");
      if (data.data.success) {
        if (data.data.permission === 'admin') {
          app.codes = data.data.message;
          app.accessDenied = false;
        } else {
          app.errorMsg = 'Insufficient permission';
        }
      } else {
        app.errorMsg = 'Insufficient permission';
      }
    });


  });
