angular.module('adminController', [])
  .controller('adminCtrl', function(User) {

    var app = this;
    app.accessDenied = true;
    app.showModal = true;

    this.openCreateEventModal = function() {
      app.errorMsg = false;
      app.successMsg = false;

      $("#createEventModal").modal({
        keyboard: false
      });

      app.showModal = true;
    };

    this.closeModal = function(eventData) {
      $('#createEventModal').modal('toggle');
      app.eventData.name = '';
      app.eventData.code = '';
      app.eventData.type = '';
    };

    this.createEvent = function(eventData) {
      app.successMsg = false;
      app.errorMsg = false;

      User.createCode(app.eventData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;

          var newEventPoints = 0;

          if (app.eventData.type == 'General Body Meeting' || app.eventData.type == 'Cabinet Meeting') {
            newEventPoints = 1;
          } else if (app.eventData.type == 'Social') {
            newEventPoints = 2;
          } else if (app.eventData.type == 'Fundraiser') {
            newEventPoints = 3;
          } else if (app.eventData.type == 'Volunteering') {
            newEventPoints = 4;
          } else {
            newEventPoints = 0;
          }

          var newEvent = {
            name: app.eventData.name,
            code: app.eventData.code,
            type: app.eventData.type,
            expiration: Date.now() + (60 * 60 * 1000),
            points: newEventPoints
          };

          app.codes.push(newEvent);
          app.showModal = false;
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };

    User.getUsers().then(function(data) {
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
