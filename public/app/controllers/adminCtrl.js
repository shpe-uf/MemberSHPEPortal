angular.module('adminController', [])
  .controller('adminCtrl', function($timeout, $route, $window, $scope, $filter, User) {

    var app = this;
    app.accessDenied = true;
    app.showCreateEventModal = true;
    app.showAttendanceModal = true;
    app.isClicked = false;
    app.eventName;

    var orderBy = $filter('orderBy');

    this.openCreateEventModal = function() {
      app.errorMsg = false;
      app.successMsg = false;

      $("#createEventModal").modal({
        backdrop: 'static',
        keyboard: false
      });

      app.showCreateEventModal = true;
    };

    this.closeCreateEventModal = function(eventData) {
      $('#createEventModal').modal('hide');
      // app.eventData.name = '';
      // app.eventData.code = '';
      app.eventData.type = '';
    };

    this.createEvent = function(eventData) {
      app.successMsg = false;
      app.errorMsg = false;

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
          app.showCreateEventModal = false;
        } else {
          app.errorMsg = data.data.message;
          console.log(data.data.message);
        }
      });
    };

    this.openAttendanceModal = function(eventData) {
      $("#attendanceModal").modal({
        backdrop: 'static'
      });

      app.eventName = eventData.name;

      User.getAttendance(eventData._id).then(function(data) {
        app.attendance = data.data.message;
      });

      app.showAttendanceModal = true;
    };

    this.closeAttendanceModal = function() {
      $('#attendanceModal').modal('hide');
    };

    this.openManualInputModal = function(eventData) {
      $("#manualInputModal").modal({
        backdrop: 'static'
      });

      app.eventName = eventData
    }

    this.manualInput = function(member) {
      app.successMsg = false;
      app.errorMsg = false;

      var manualInput = {
        member: null,
        eventId: null
      };

      manualInput.member = app.member;
      manualInput.eventId = app.eventName._id;

      console.log(manualInput);

      User.manualInput(manualInput).then(function(data) {
        if (data.data.success) {

        } else {
          app.errorMsg = data.data.message;
        }
      });
    };

    this.closeManualInputModal = function() {
      $('#manualInputModal').modal('hide');
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
      app.isClicked = true;
      User.approveRequest(approveData).then(function(data) {});

      // $timeout(function() {
      $window.location.reload();
      // }, 1500);
    };

    this.denyRequest = function(denyData) {
      app.isClicked = true;
      User.denyRequest(denyData).then(function(data) {});

      // $timeout(function() {
      $window.location.reload();
      // }, 1500);
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

    this.sortBy = function(propertyName, array) {
      $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName) ?
        !$scope.reverse : false;
      $scope.propertyName = propertyName;
      app.users = orderBy(array, $scope.propertyName, $scope.reverse);
    };

  });
