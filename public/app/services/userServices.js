angular.module('userServices', [])

  .factory('User', function($http) {
    var userFactory = {};

    userFactory.create = function(regData) {
      return $http.post('/api/users', regData);
    }

    userFactory.sendUsername = function(userData) {
      return $http.get('/api/forgetusername/' + userData);
    };

    return userFactory;
  });
