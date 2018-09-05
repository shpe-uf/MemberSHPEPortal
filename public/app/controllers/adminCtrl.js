angular.module('adminController', [])
  .controller('adminCtrl', function($timeout, $route, $window, User) {

    var app = this;
    app.accessDenied = true;
    app.showModal = true;

    this.openCreateEventModal = function() {
      app.errorMsg = false;
      app.successMsg = false;

      $("#createEventModal").modal({
        backdrop: 'static',
        keyboard: false
      });

      app.showModal = true;
    };

    this.closeModal = function(eventData) {
      $('#createEventModal').modal('hide');
      // app.eventData.name = '';
      // app.eventData.code = '';
      app.eventData.type = '';
    };

    this.createEvent = function(eventData) {
      app.successMsg = false;
      app.errorMsg = false;

      console.log(eventData);

      User.createCode(app.eventData).then(function(data) {

        if (data.data.success) {
          app.successMsg = data.data.message;

          var newEventPoints = 0;

          if (app.eventData.type == 'General Body Meeting' || app.eventData.type == 'Cabinet Meeting' || app.eventData.type == 'Social' || app.eventData.type == 'Form/Survey') {
            newEventPoints = 1;
          } else if (app.eventData.type == 'Corporate Event') {
            newEventPoints = 2;
          } else if (app.eventData.type == 'Fundraiser') {
            newEventPoints = 3;
          } else if (app.eventData.type == 'Volunteering') {
            newEventPoints = 4;
          } else if (app.eventData.type == 'Miscellaneous') {
            newEventPoints = 5;
          } else {
            newEventPoints = 0;
          }

          var newEvent = {
            name: app.eventData.name,
            code: app.eventData.code.toLowerCase(),
            type: app.eventData.type,
            expiration: Date.now() + (app.eventData.expiration * 60 * 60 * 1000),
            points: newEventPoints
          };

          app.codes.push(newEvent);
          app.showModal = false;
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };

    // this.nationalityChart = function() {
    //   var nationalityLabels = [];
    //   var nationalityDatasets = [];
    //
    //   User.getUsers().then(function(data) {
    //     if (data.data.success) {
    //       if (data.data.permission === 'admin') {
    //         var usersNat = data.data.message;
    //
    //         for (var i = 0; i < usersNat.length; i++) {
    //           nationalityLabels.push(usersNat[i].nationality);
    //         }
    //
    //         console.log(nationalityLabels);
    //
    //         app.accessDenied = false;
    //       } else {
    //         app.errorMsg = 'Insufficient permission';
    //       }
    //     } else {
    //       app.errorMsg = data.data.message;
    //     }
    //   });
    //
    //   var ctx = document.getElementById("nationalityChart").getContext('2d');
    //   var myChart = new Chart(ctx, {
    //     type: 'doughnut',
    //     data: {
    //       datasets: [{
    //         data: [10, 20, 30]
    //       }],
    //       labels: [
    //         'Red',
    //         'Yellow',
    //         'Blue'
    //       ]
    //     },
    //     options: {
    //       legend: {
    //         position: 'bottom'
    //       }
    //     }
    //   });
    // };

    this.acceptRequest = function(approveData) {
      console.log(approveData);
      User.approveRequest(approveData).then(function(data) {
        console.log("APPROVE DATA: " + data);
      });

      $timeout(function() {
        $window.location.reload();
      }, 1500);
    };

    this.denyRequest = function(denyData) {
      console.log(denyData);
      User.denyRequest(denyData).then(function(data) {
        console.log("DENY DATA: " + data);
      });

      $timeout(function() {
        $window.location.reload();
      }, 1500);
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

    User.getRequests().then(function(data) {
      if (data.data.success) {
        app.requests = data.data.message;
      }
    });
  });
