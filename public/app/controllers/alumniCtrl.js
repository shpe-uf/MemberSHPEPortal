angular.module('alumniController', [])
  .controller('alumniCtrl', function(User) {
    var app = this;

    app.alumniArray = [];

    User.getAlumni().then(function(data) {
      app.alumniArray = data.data.message;
    });

  });
