angular.module('adminController', [])
  .controller('adminCtrl', function($timeout, $route, $window, $scope, $filter, $http, fileReader, User) {

    var app = this;
    app.accessDenied = true;
    app.showCreateEventModal = true;
    app.showEventInfoModal = true;
    app.isClicked = false;
    app.eventName;
    app.eventId;
    var orderBy = $filter('orderBy');

    $scope.imageSrc = "";

    $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });

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

    this.openCreateEventModal = function() {
      app.errorMsg = false;
      app.successMsg = false;

      $("#createEventModal").modal({
        backdrop: 'static',
        keyboard: false
      });

      app.showCreateEventModal = true;
    };

    this.closeCreateEventModal = function() {
      $('#createEventModal').modal('hide');
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

    this.closeManualInputModal = function(member) {
      $('#manualInputModal').modal('hide');

      if (app.member) {
        app.member.userName = '';
      }

      app.errorMsg = false;
      app.successMsg = false;
    };

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

    this.openAddCompanyModal = function() {
      app.addCompanySuccessMsg = false;
      app.addCompanyErrorMsg = false;
      $("#addCompanyModal").modal({
        backdrop: 'static'
      });
    }

    this.closeAddCompanyModal = function() {
      $('#addCompanyModal').modal('hide');
      app.addCompanySuccessMsg = false;
      app.addCompanyErrorMsg = false;
    }

    this.addCompany = function(companyData) {
      app.addCompanySuccessMsg = false;
      app.addCompanyErrorMsg = false;

      User.addCompany(companyData).then(function(data) {
        if (data.data.success) {
          app.addCompanySuccessMsg = data.data.message;
          app.addCompanyErrorMsg = false;
        } else {
          app.addCompanySuccessMsg = false;
          app.addCompanyErrorMsg = data.data.message;
        }
      });
    }

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

    User.getCompanies().then(function(data) {
      if (data.data.success) {
        app.companies = data.data.message;
      }
    });

    this.sortBy = function(propertyName, array) {
      $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName) ?
        !$scope.reverse : false;
      $scope.propertyName = propertyName;
      app.users = orderBy(array, $scope.propertyName, $scope.reverse);
    };
  })

  .directive('ngFileSelect', function(fileReader, $timeout) {
    return {
      scope: {
        ngModel: '='
      },
      link: function($scope, el) {
        function getFile(file) {
          console.log("FILE:");
          console.log(file);
          fileReader.readAsDataUrl(file, $scope)
            .then(function(result) {
              $timeout(function() {
                $scope.ngModel = result;
              });
            });
        }

        el.bind("change", function(e) {
          var file = (e.srcElement || e.target).files[0];
          getFile(file);
        });
      }
    };
  })

  .factory('fileReader', function($q, $log) {
    var onLoad = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    };

    var onError = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    };

    var onProgress = function(reader, scope) {
      return function(event) {
        scope.$broadcast("fileProgress", {
          total: event.total,
          loaded: event.loaded
        });
      };
    };

    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };

    var readAsDataURL = function(file, scope) {
      console.log("FILE:");
      console.log(file);
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    };

    return {
      readAsDataUrl: readAsDataURL
    };
  });
