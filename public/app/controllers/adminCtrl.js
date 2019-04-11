angular.module('adminController', ['userServices'])
  .controller('adminCtrl', function($timeout, $route, $window, $scope, $filter, $http, User) {

    var app = this;
    app.accessDenied = true;
    app.showCreateEventModal = true;
    app.showEventInfoModal = true;
    app.isClicked = false;
    app.eventName;
    app.eventId;
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
    };

    this.createEvent = function(eventData) {
      app.successMsg = false;
      app.errorMsg = false;

      User.createCode(app.eventData).then(function(data) {
        if (data.data.success) {
          app.successMsg = "Success! Event created!";
          app.codes.push(data.data.message);
          app.showCreateEventModal = false;
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };

    this.openEventInfoModal = function(eventData) {
      $("#eventInfoModal").modal({
        backdrop: 'static'
      });

      app.eventName = eventData.name;
      app.eventId = eventData._id;

      User.getAttendance(eventData._id).then(function(data) {
        app.attendance = data.data.message;
      });

      app.showEventInfoModal = true;
    };

    this.closeEventInfoModal = function() {
      $('#eventInfoModal').modal('hide');
    };

    this.openManualInputModal = function(eventData) {
      app.successMsg = false;
      app.errorMsg = false;

      $("#manualInputModal").modal({
        backdrop: 'static'
      });

      app.eventName = eventData
    }

    this.manualInput = function(member) {
      app.successMsg = '';
      app.errorMsg = '';


      var manualInput = {
        member: null,
        eventId: null
      };

      manualInput.member = app.member;
      manualInput.eventId = app.eventName._id;

      User.manualInput(manualInput).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };

    this.closeManualInputModal = function(member) {
      $('#manualInputModal').modal('hide');

      if (app.member) {
        app.member.userName = '';
      }

      app.errorMsg = false;
      app.successMsg = false;
    };

    this.acceptRequest = function(approveData) {
      app.isClicked = true;
      User.approveRequest(approveData).then(function(data) {
        $window.location.reload();
      });
    };

    this.denyRequest = function(denyData) {
      app.isClicked = true;
      User.denyRequest(denyData).then(function(data) {
        $window.location.reload();
      });
    };

    this.excel = function(eventId) {
      User.getExcelDoc(eventId).then(function(data) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = "data:attachment/csv," + encodeURI(data.data);
        hiddenElement.target = "_blank";
        hiddenElement.download = eventId + ".csv";
        hiddenElement.click();
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

    User.getRequests().then(function(data) {
      if (data.data.success) {
        app.requests = data.data.message;
      }
    });

    this.openUserInfoModal = function(data) {
      $("#userEventsModal").modal({
        backdrop: 'static'
      });

      app.UserName = data;
      app.showEventsModal = true;

      User.getUserInfo(data).then(function(userData) {
        app.eventArray = [];
        if (userData.data.success) {
          app.user = userData.data.message[0];
          if (app.user.events.length > 0) {
            for (var i = 0; i < app.user.events.length; i++) {
              User.getCodeInfo(app.user.events[i]._id).then(function(eventsInfo) {
                if (eventsInfo.data.success) {
                  app.eventArray.push(eventsInfo.data.message);
                }
              });
            };
          }
        }
      });

    };

    this.closeUserInfoModal = function() {
      app.UserName = false;
      app.eventArray = [];
      $('#userEventsModal').modal('hide');
    };

    this.sortBy = function(propertyName, array) {
      $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName) ?
        !$scope.reverse : false;
      $scope.propertyName = propertyName;
      app.users = orderBy(array, $scope.propertyName, $scope.reverse);
    };

    this.changePermission = function(username, permissiontype) {
      var userData = {
        username: username,
        permission: permissiontype
      };
      console.log(userData)
      User.changeUserPermission(userData).then(function(data){
        if (data.data.success == true)
        app.user.permission = permissiontype;
      });
    };
  });
