angular.module('mainController', ['authServices', 'userServices'])
  .controller('mainCtrl', function($timeout, $location, $rootScope, $interval, $window, $route, Auth, User, AuthToken) {

    var app = this;
    app.loadme = false;
    app.showModal = true;
    app.events;

    this.openRequestModal = function() {
      app.errorMsg = false;
      app.successMsg = false;

      $("#createRequestModal").modal({
        backdrop: 'static',
        keyboard: false
      });

      app.showModal = true;
    };

    this.closeRequestModal = function() {
      $('#createRequestModal').modal('hide');
      $window.location.reload();

      // $timeout(function() {
        // hideModal();
        // $('.modal-backdrop').remove();
      // }, 2000);

    };

    this.createRequest = function(requestData) {
      app.successMsg = false;
      app.errorMsg = false;

      User.addRequest(app.requestData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          app.showModal = false;
        } else {
          app.errorMsg = data.data.message;
        }
      });

      app.requestData = '';
    };

    this.openPointsSystemModal = function() {
      console.log("HELLO");
      $("#pointsSystemModal").modal({
        backdrop: 'static',
        keyboard: false
      });
    }

    this.closePointsSystemModal = function() {
      $('#pointsSystemModal').modal('hide');
    }

    app.checkSession = function() {
      if (Auth.isLoggedIn()) {
        app.checkInSession = true;
        var interval = $interval(function() {
          var token = $window.localStorage.getItem('token');

          if (token === null) {
            $interval.cancel(interval);
          } else {

            self.parseJwt = function(token) {
              var base64url = token.split('.')[1];
              var base64 = base64url.replace('-', '+').replace('_', '/');
              return JSON.parse($window.atob(base64));
            };

            var expireTime = self.parseJwt(token);
            var timeStamp = Math.floor(Date.now() / 1000);

            var timeCheck = expireTime.exp - timeStamp;

            console.log("TIME REMAINING: " + timeCheck);

            if (timeCheck <= 600) {
              showModal(1);
              $interval.cancel(interval);
            }
          }
        }, 30000);
      }
    };

    app.checkSession();

    var showModal = function(option) {
      app.choiceMade = false;
      app.modalHeader = undefined;
      app.modalBody = undefined;
      app.hideButton = false;

      if (option === 1) {
        app.modalHeader = 'Timeout Warning';
        app.modalBody = 'Your session will expire in 10 minutes. Would you like to renew your session?';
        $("#tokenExpire").modal({
          backdrop: "static"
        });
        $timeout(function() {
          if (!app.choiceMade) app.endSession();
        }, 10000);
      } else if (option === 2) {
        app.hideButton = true;
        app.modalHeader = 'Logging out';
        $("#tokenExpire").modal({
          backdrop: "static"
        });
        $timeout(function() {
          Auth.logout();
          $location.path('/');
          hideModal();
          $window.location.reload();
        }, 2000);
      }
    };

    app.renewSession = function() {
      app.choiceMade = true;

      User.renewSession(app.username).then(function(data) {
        if (data.data.success) {
          AuthToken.setToken(data.data.message);
          app.checkSession();
        } else {
          app.modalBody = data.data.message;
        }
      });
      hideModal();
    };

    app.endSession = function() {
      app.choiceMade = true;
      hideModal();
      $timeout(function() {
        showModal(2);
      }, 1000);
    };

    var hideModal = function() {
      $("#tokenExpire").modal('hide');
    };

    $rootScope.$on('$routeChangeStart', function() {

      if (!app.checkInSession) app.checkSession();

      if (Auth.isLoggedIn()) {
        app.isLoggedIn = true;

        Auth.getUser().then(function(data) {

          app.firstName = data.data.firstName;
          app.lastName = data.data.lastName;
          app.username = data.data.username;
          app.email = data.data.email;
          app.major = data.data.major;
          app.year = data.data.year;
          app.nationality = data.data.nationality;
          app.ethnicity = data.data.ethnicity;
          app.sex = data.data.sex;
          app.points = data.data.points;
          app.events = data.data.events;

          app.showEvents(app.events);

          User.getPermission().then(function(data) {
            if (data.data.message === 'admin') {
              app.authorized = true;
              app.loadme = true;
            } else {
              app.authorized = false;
              app.loadme = true;
            }
          });

          User.getPercentile(app.username).then(function(data) {
            if (data.data.success) {
              var pointsArray = data.data.message;
              var userPoints = app.points;
              var totalUsers = pointsArray.length;
              var belowUsers = 0;

              for (var i = 0; i < pointsArray.length; i++) {
                if (userPoints > pointsArray[i].points) {
                  belowUsers += 1;
                }
              }

              app.percentile = Math.trunc(((belowUsers/totalUsers) * 100));
            }
          });
        });


      } else {
        app.isLoggedIn = false;
        app.username = '';
        app.email = '';
        app.loadme = true;
      }
    });

    this.doLogin = function(loginData) {
      app.errorMsg = false;

      Auth.login(app.loginData).then(function(data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          $timeout(function() {
            $location.path('/profile');
            app.loginData = '';
            app.successMsg = false;
            app.checkSession();
          }, 1000);
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };

    app.logout = function() {
      showModal(2);
    };

    app.updateProfile = function() {
      $("#profileUpdate").modal({
        backdrop: "static"
      });
    };

    app.showEvents = function(eventIds) {

      app.codeArray = [];

      if (eventIds.length > 0) {
        for (var i = 0; i < eventIds.length; i++) {
          User.getCodeInfo(eventIds[i]).then(function(codeData) {
            app.codeArray.push(codeData.data.message);
          });
        }
      }

    }

  });
