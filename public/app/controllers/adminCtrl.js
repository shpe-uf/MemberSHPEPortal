angular.module('adminController', [])
  .controller('adminCtrl', function($timeout, $route, $window, $scope, $filter, User) {

    var app = this;
    app.accessDenied = true;
    app.showCreateEventModal = true;
    app.showMoreModal = true;
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
      app.eventData.type = '';
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

    this.openMoreModal = function(eventData) {
      $("#moreModal").modal({
        backdrop: 'static'
      });

      app.eventName = eventData.name;
      app.eventId = eventData._id;

      User.getAttendance(eventData._id).then(function(data) {
        app.attendance = data.data.message;
      });

      app.showMoreModal = true;
    };

    this.closeMoreModal = function() {
      $('#moreModal').modal('hide');
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

    this.excel = function(eventData) {
      User.getExcelDoc(eventData).then(function(data) {
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

    this.sortBy = function(propertyName, array) {
      $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName) ?
        !$scope.reverse : false;
      $scope.propertyName = propertyName;
      app.users = orderBy(array, $scope.propertyName, $scope.reverse);
    };

  });
